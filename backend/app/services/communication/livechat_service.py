from typing import Dict, List
from fastapi import WebSocket

class LiveChatManager:
    def __init__(self):
        # Map of customer_session_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        # We could also keep a list of Agent WebSockets if they connect directly
        self.agent_connections: List[WebSocket] = []

    async def connect_customer(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect_customer(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_personal_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

    async def connect_agent(self, websocket: WebSocket):
        await websocket.accept()
        self.agent_connections.append(websocket)

    def disconnect_agent(self, websocket: WebSocket):
        if websocket in self.agent_connections:
            self.agent_connections.remove(websocket)

    async def broadcast_to_agents(self, message: str):
        for connection in self.agent_connections:
            await connection.send_text(message)

# Global singleton
live_chat_manager = LiveChatManager()
