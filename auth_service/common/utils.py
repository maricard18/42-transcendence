def get_secret_from_file(path):
    if path:
        file = open(str(path), 'r')
        content = None
        for line in file:
            content = line.strip()
            break
        file.close()
        return content
    return None
