// Исключительно серьезный и чистый Python
const codeSnippets = [
    "import os\nimport sys\nimport asyncio\nimport socket\nfrom datetime import datetime\n\nasync def initiate_core_dump(target_pid: int) -> bytes:\n    ''' Extracts raw memory frames from target process space '''\n    try:\n        mem_path = f'/proc/{target_pid}/mem'\n        maps_path = f'/proc/{target_pid}/maps'\n        if not os.path.exists(mem_path): return b''\n        \n        with open(maps_path, 'r') as maps, open(mem_path, 'rb') as mem:\n            for line in maps:\n                start, end = line.split(' ')[0].split('-')\n                mem.seek(int(start, 16))\n                return mem.read(int(end, 16) - int(start, 16))\n    except IOError as e:\n        sys.stderr.write(f'[-] Memory map restriction: {str(e)}\\n')\n        return b''",

    "@kernel_handler.register_payload(stealth=True)\ndef deploy_socket_bridge(*args, **kwargs) -> list:\n    ''' Establishes a secure encrypted reverse shell connection '''\n    session_token = kwargs.get('auth_token')\n    if not session_token:\n        raise PermissionError('Kernel communication rejected: Missing token')\n    \n    nodes = ['10.0.4.11', '172.16.22.8', '192.168.1.254']\n    active_bridges = []\n    for ip in nodes:\n        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        s.settimeout(2.5)\n        active_bridges.append(s)\n    return active_bridges",

    "class NetworkScanner:\n    def __init__(self, subnet: str):\n        self.subnet = subnet\n        self.buffer_size = 4096\n\n    def raw_packet_injection(self, payload: bytes) -> bool:\n        raw_socket = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_RAW)\n        raw_socket.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)\n        bytes_sent = raw_socket.sendto(payload, (self.subnet, 0))\n        return bytes_sent > 0",

    "if __name__ == '__main__':\n    print(f'[{datetime.now()}] Initializing deployment sequence...')\n    loop = asyncio.get_event_loop()\n    try:\n        kernel_data = loop.run_until_complete(initiate_core_dump(os.getpid()))\n        if kernel_data:\n            print('[+] Memory override successful. Extracting stack...')\n    except KeyboardInterrupt:\n        sys.exit(0)"
];

const consoleDiv = document.getElementById('console');
let currentChunk = ""; 
const symbolsPerClick = 2; // Скорость вывода кода

function getNextHackerChunk() {
    // Берём случайный кусок чистого Python-кода
    return codeSnippets[Math.floor(Math.random() * codeSnippets.length)] + "\n\n";
}

currentChunk = getNextHackerChunk();

document.addEventListener('keydown', function(event) {
    // F11 и Esc работают штатно, печать не ломается
    if (event.key === 'F11' || event.key === 'Escape') {
        return; 
    }

    // Пропускаем системные клавиши, оставляем буквы, цифры, пробел и Enter
    if (event.key.length > 1 && event.key !== 'Enter' && event.key !== ' ') {
        return; 
    }

    event.preventDefault(); 

    if (currentChunk.length === 0) {
        currentChunk = getNextHackerChunk();
    }

    const textToAppend = currentChunk.substring(0, symbolsPerClick);
    consoleDiv.textContent += textToAppend;
    currentChunk = currentChunk.substring(symbolsPerClick);

    window.scrollTo(0, document.body.scrollHeight);
});