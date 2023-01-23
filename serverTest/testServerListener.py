import socket


PORT = 2001#A space odyssy

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('localhost', PORT));
server.listen()

rxset = [server]
txset = []



try:
    while True:
        print("listening for connection")
        connection, address = server.accept();
        with connection:
            print("receved connection, listening...")
            indentLevel = 0
            while True:
                data = connection.recv(1)
                if not data: break
                char = chr(data[0])
                if(char == ','):
                    print(",")
                    for i in range(indentLevel):
                        print("  ", end='')
                    continue
                if(char == '\r'):
                    print("\\r", end='')
                    continue
                if(char == '\n'):
                    print("\\n")
                    for i in range(indentLevel):
                        print("  ", end='')
                    continue
                if(char == '{'): 
                    indentLevel += 1
                    print("{")
                    for i in range(indentLevel):
                        print("  ", end='')
                    continue
                if(char == '}'): 
                    indentLevel -= 1
                    print()
                    for i in range(indentLevel):
                        print("  ", end='')
                
                print(char, end='')
            print("\nending connection")
finally:
    print("\nerror thrown, closing port")
    server.close()
