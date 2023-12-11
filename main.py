import asyncio
import websockets
import os

async def file_watcher(filename):
    previous_size = 0
    while True:
        current_size = os.path.getsize(filename)
        if current_size > previous_size:
            with open(filename) as f:
                f.seek(previous_size)
                new_lines = f.read().splitlines()
                for line in new_lines:
                    await broadcast(line)
        previous_size = current_size
        await asyncio.sleep(0.1)

async def broadcast(message):
    for connection in connections:
        print(f'sending message: ' + message)
        await connection.send(message.encode('utf-8'))

async def handler(websocket, path):
    connections.add(websocket)
    try:
        async for message in websocket:
            print(f"Received message from {websocket.id}: {message}")
            with open('data.txt', 'a') as f:
                f.write(f'{websocket.id} : {message}\n')

    finally:
        connections.remove(websocket)

async def main():
    global connections
    connections = set()
    async with websockets.serve(handler, 'localhost', 8765):
        asyncio.create_task(file_watcher('data.txt'))
        await asyncio.Future()

if __name__ == '__main__':
    asyncio.run(main())