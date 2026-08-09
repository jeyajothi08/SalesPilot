import os

root_dir = r"C:\Users\Admin\OneDrive\Desktop\AI\SalesPilot\backend\app"

for root, dirs, files in os.walk(root_dir):
    # ignore __pycache__
    if '__pycache__' in root:
        continue
    
    init_path = os.path.join(root, "__init__.py")
    if not os.path.exists(init_path):
        with open(init_path, 'w', encoding='utf-8') as f:
            f.write("# __init__.py\n")
        print(f"Created {init_path}")
