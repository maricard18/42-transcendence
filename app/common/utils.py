def get_file_content(path):
    if path:
        file = open(str(path), 'r')
        content = file.read()
        file.close()

        return content
    return None

def get_file_content_strip(path):
    if path:
        file = open(str(path), 'r')
        content = file.read().strip()
        file.close()
        return content
    return None
