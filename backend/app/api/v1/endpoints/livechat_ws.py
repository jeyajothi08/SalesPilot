from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.communication.livechat_service import live_chat_manager
import json

router = APIRouter()

@router.websocket("/ws/customer/{session_id}")
async def websocket_customer_endpoint(websocket: WebSocket, session_id: str):
    await live_chat_manager.connect_customer(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the customer's message to all connected agents
            payload = json.dumps({
                "type": "customer_message",
                "session_id": session_id,
                "content": data
            })
            await live_chat_manager.broadcast_to_agents(payload)
    except WebSocketDisconnect:
        live_chat_manager.disconnect_customer(session_id)
        # Notify agents that customer left
        await live_chat_manager.broadcast_to_agents(json.dumps({
            "type": "customer_disconnect",
            "session_id": session_id
        }))

@router.websocket("/ws/agent")
async def websocket_agent_endpoint(websocket: WebSocket):
    await live_chat_manager.connect_agent(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Expecting JSON string from agent: {"session_id": "...", "content": "..."}
            try:
                payload = json.loads(data)
                target_session = payload.get("session_id")
                content = payload.get("content")
                if target_session and content:
                    await live_chat_manager.send_personal_message(
                        json.dumps({"type": "agent_message", "content": content}),
                        target_session
                    )
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        live_chat_manager.disconnect_agent(websocket)
