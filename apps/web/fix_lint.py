import re

with open('lint_output.txt', 'r', encoding='utf-16le') as f:
    content = f.read()

warnings = []
lines = content.split('\n')
for i, line in enumerate(lines):
    if '! eslint(no-unused-vars): Identifier' in line:
        match = re.search(r"Identifier '(.*?)' is imported", line)
        if match:
            ident = match.group(1)
            path = lines[i+1].split(',-[')[1].split(']')[0]
            warnings.append({'type': 'import', 'ident': ident, 'path': path.split(':')[0], 'line': int(path.split(':')[1])})
    elif '! eslint(no-unused-vars): Variable' in line:
        match = re.search(r"Variable '(.*?)' is declared", line)
        if match:
            ident = match.group(1)
            path = lines[i+1].split(',-[')[1].split(']')[0]
            warnings.append({'type': 'var', 'ident': ident, 'path': path.split(':')[0], 'line': int(path.split(':')[1])})
    elif '! eslint(no-unused-vars): Parameter' in line:
        match = re.search(r"Parameter '(.*?)' is declared", line)
        if match:
            ident = match.group(1)
            path = lines[i+1].split(',-[')[1].split(']')[0]
            warnings.append({'type': 'param', 'ident': ident, 'path': path.split(':')[0], 'line': int(path.split(':')[1])})
    elif '! eslint(no-unused-vars): Catch parameter' in line:
        match = re.search(r"Catch parameter '(.*?)' is caught", line)
        if match:
            ident = match.group(1)
            path = lines[i+1].split(',-[')[1].split(']')[0]
            warnings.append({'type': 'param', 'ident': ident, 'path': path.split(':')[0], 'line': int(path.split(':')[1])})

# Group by file
files = {}
for w in warnings:
    if w['path'] not in files:
        files[w['path']] = []
    files[w['path']].append(w)

for path, warns in files.items():
    with open(path, 'r', encoding='utf-8') as f:
        file_lines = f.readlines()
    
    for w in warns:
        line_idx = w['line'] - 1
        ident = w['ident']
        if w['type'] == 'import':
            # Remove the identifier from the import statement
            line_str = file_lines[line_idx]
            
            # Cases:
            if re.match(r"^\s*import\s*{\s*" + ident + r"\s*}\s*from", line_str):
                file_lines[line_idx] = "// " + line_str
            elif re.match(r"^\s*import\s+" + ident + r"\s+from", line_str):
                file_lines[line_idx] = "// " + line_str
            else:
                new_line = re.sub(r",\s*" + ident + r"\b", "", line_str)
                new_line = re.sub(r"\b" + ident + r"\s*,", "", new_line)
                new_line = re.sub(r"{\s*" + ident + r"\s*}", "{}", new_line)
                file_lines[line_idx] = new_line
        
        elif w['type'] in ('var', 'param'):
            line_str = file_lines[line_idx]
            file_lines[line_idx] = re.sub(r"\b" + ident + r"\b", "_" + ident, line_str)

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(file_lines)

print(f"Fixed {len(warnings)} warnings.")
