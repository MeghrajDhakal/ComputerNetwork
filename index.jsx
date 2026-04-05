import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e1a",
  bgCard: "#111827",
  bgCardHover: "#1a2236",
  border: "#1e2d45",
  accent: "#00d4ff",
  accent2: "#7c3aed",
  accent3: "#10b981",
  accent4: "#f59e0b",
  accent5: "#ef4444",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textSub: "#94a3b8",
};

const topics = [
  { id: "switching", icon: "⇄", label: "Switching & Bridging", color: "#00d4ff" },
  { id: "ip", icon: "◉", label: "Internet Protocol", color: "#7c3aed" },
  { id: "ipaddr", icon: "⊞", label: "IP Addressing", color: "#10b981" },
  { id: "cidr", icon: "⌥", label: "CIDR", color: "#f59e0b" },
  { id: "subnetting", icon: "⊟", label: "Subnetting", color: "#ef4444" },
  { id: "supernetting", icon: "⊕", label: "Supernetting", color: "#ec4899" },
  { id: "nat", icon: "↔", label: "NAT", color: "#06b6d4" },
  { id: "arp", icon: "⇌", label: "ARP", color: "#84cc16" },
  { id: "dhcp", icon: "⊛", label: "DHCP", color: "#f97316" },
  { id: "icmp", icon: "⚡", label: "ICMP", color: "#a855f7" },
  { id: "routing", icon: "⬡", label: "Routing Algorithms", color: "#14b8a6" },
];

const topicData = {
  switching: {
    title: "Switching & Bridging",
    color: "#00d4ff",
    intro: "Switching and bridging are Layer 2 technologies that intelligently forward frames within a network. Unlike hubs (which broadcast everywhere), switches learn which devices are on which ports and deliver frames only to the intended recipient.",
    analogy: "Think of a switch like a smart post office that remembers which mailbox belongs to which address — no wasted deliveries!",
    sections: [
      {
        heading: "Circuit Switching",
        content: "A dedicated communication path is established for the entire duration of a session. Used in traditional telephone networks. Resources are reserved end-to-end — even if no data is being sent, the path is held.",
        formula: "Efficiency = (Actual transmission time) / (Total connection time)",
        example: "Traditional PSTN phone calls: when you dial, a circuit is established through exchanges all the way to the recipient before any voice is transmitted."
      },
      {
        heading: "Packet Switching",
        content: "Data is broken into packets that travel independently across the network. Each packet may take a different route. Used in the Internet. Resources are shared — far more efficient than circuit switching.",
        formula: "Total delay = Propagation delay + Transmission delay + Queuing delay + Processing delay",
        example: "Email, web browsing, video streaming — all use packet switching. Your YouTube video arrives in thousands of packets that reassemble at your device."
      },
      {
        heading: "Bridges & Switches",
        content: "A bridge connects two LAN segments and filters traffic using MAC addresses. A switch is a multi-port bridge with hardware-accelerated switching. Switches maintain a MAC Address Table (CAM table) mapping MAC addresses to ports.",
        formula: "Switch learning: if source MAC not in table → add (MAC, port, timestamp); if dest MAC in table → forward to that port; else → flood all ports",
        example: "In a 48-port switch, when PC-A (port 3) sends to PC-B (port 15), the switch forwards only to port 15 — not all 48 ports."
      }
    ],
    quiz: [
      { q: "What does a switch use to make forwarding decisions?", opts: ["IP addresses", "MAC addresses", "Port numbers", "Hostnames"], ans: 1 },
      { q: "In circuit switching, what happens to reserved resources during idle periods?", opts: ["Released back to pool", "Used by other connections", "Wasted/held", "Shared automatically"], ans: 2 },
      { q: "What does a switch do when it doesn't know the destination MAC?", opts: ["Drops the frame", "Sends to router", "Floods all ports", "Requests ARP"], ans: 2 },
    ]
  },
  ip: {
    title: "Internet Protocol (IP)",
    color: "#7c3aed",
    intro: "IP is the principal communications protocol in the Internet protocol suite for relaying datagrams across network boundaries. It provides logical addressing, routing, and fragmentation of data.",
    analogy: "IP is like the postal system's addressing standard — it defines the format of the address on every envelope (packet) traveling through the internet.",
    sections: [
      {
        heading: "IPv4 Header Structure",
        content: "The IPv4 header is 20-60 bytes and contains critical routing and control information. Key fields: Version (4 bits), IHL (4 bits), DSCP (6 bits), Total Length (16 bits), TTL (8 bits), Protocol (8 bits), Source/Destination IP (32 bits each).",
        formula: "Max IPv4 packet size = 65,535 bytes\nHeader size = 20 bytes (minimum)\nData size = Total Length − (IHL × 4)",
        example: "A packet from 192.168.1.10 to 8.8.8.8 with TTL=64 decrements TTL at each router hop. When TTL=0, the packet is discarded and ICMP Time Exceeded is sent."
      },
      {
        heading: "IP Fragmentation",
        content: "When a packet is larger than the MTU (Maximum Transmission Unit) of a network link, IP fragments it into smaller pieces. Each fragment has the same ID but different offsets. Reassembly happens at the destination.",
        formula: "Fragment Offset = (Start byte of fragment) / 8\nNumber of fragments = ⌈(Data length) / (MTU − Header)⌉",
        example: "MTU=1500 bytes, packet=3000 bytes data + 20 byte header. Fragment 1: bytes 0-1479 (offset=0), Fragment 2: bytes 1480-2959 (offset=185), Fragment 3: bytes 2960-2999 (offset=370)."
      },
      {
        heading: "IPv4 vs IPv6",
        content: "IPv4 uses 32-bit addresses (4.3 billion). IPv6 uses 128-bit addresses (340 undecillion). IPv6 eliminates fragmentation at routers, has simplified headers, built-in IPSec, and no broadcast addresses.",
        formula: "IPv4 space: 2³² = 4,294,967,296 addresses\nIPv6 space: 2¹²⁸ = 340,282,366,920,938,463,463,374,607,431,768,211,456",
        example: "IPv4: 192.168.0.1 | IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334 (compressed: 2001:db8:85a3::8a2e:370:7334)"
      }
    ],
    quiz: [
      { q: "What is the minimum size of an IPv4 header?", opts: ["16 bytes", "20 bytes", "24 bytes", "32 bytes"], ans: 1 },
      { q: "What happens when TTL reaches 0?", opts: ["Packet is delivered", "Packet is retransmitted", "Packet is discarded", "Packet is fragmented"], ans: 2 },
      { q: "IPv6 addresses are how many bits?", opts: ["32 bits", "64 bits", "96 bits", "128 bits"], ans: 3 },
    ]
  },
  ipaddr: {
    title: "IP Addressing",
    color: "#10b981",
    intro: "IP addresses are 32-bit (IPv4) numbers that uniquely identify devices on a network. They are written in dotted-decimal notation and divided into network and host portions by a subnet mask.",
    analogy: "An IP address is like a physical postal address: the network portion is your city/street, and the host portion is your house number.",
    sections: [
      {
        heading: "Classful Addressing (Legacy)",
        content: "Originally, IP addresses were divided into five classes: A, B, C, D (multicast), E (reserved). The class was determined by the leading bits. This was inefficient and led to address exhaustion.",
        formula: "Class A: 0xxxxxxx — 1.0.0.0 to 126.255.255.255 — /8 — 16M hosts/network\nClass B: 10xxxxxx — 128.0.0.0 to 191.255.255.255 — /16 — 65K hosts/network\nClass C: 110xxxxx — 192.0.0.0 to 223.255.255.255 — /24 — 254 hosts/network",
        example: "Company A gets a Class A (e.g., 10.0.0.0/8) — 16 million addresses. Company B only needs 1000 hosts but must get a Class B — 65,534 addresses. 64,534 wasted!"
      },
      {
        heading: "Special IP Addresses",
        content: "Certain IP ranges are reserved for special purposes: loopback (127.x.x.x), private use (RFC 1918), link-local (169.254.x.x), broadcast, and multicast ranges.",
        formula: "Private ranges (RFC 1918):\n10.0.0.0/8 (Class A private)\n172.16.0.0/12 (Class B private)\n192.168.0.0/16 (Class C private)\nLoopback: 127.0.0.0/8",
        example: "Your home router likely assigns addresses from 192.168.1.0/24. Your laptop might be 192.168.1.105. These never appear on the public internet — only inside your home network."
      },
      {
        heading: "Subnet Mask & Network Address",
        content: "A subnet mask identifies which bits are the network portion (1s) and host portion (0s). ANDing an IP with its mask gives the network address. The broadcast address is the network address with all host bits set to 1.",
        formula: "Network address = IP AND Subnet mask\nBroadcast = Network address OR (NOT Subnet mask)\nUsable hosts = 2ʰ − 2 (where h = host bits)",
        example: "IP: 192.168.10.55, Mask: 255.255.255.0\nNetwork: 192.168.10.55 AND 255.255.255.0 = 192.168.10.0\nBroadcast: 192.168.10.255\nUsable: 192.168.10.1 – 192.168.10.254 (254 hosts)"
      }
    ],
    quiz: [
      { q: "Which class has a default /24 subnet mask?", opts: ["Class A", "Class B", "Class C", "Class D"], ans: 2 },
      { q: "What is the private IP range for Class B?", opts: ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "169.254.0.0/16"], ans: 1 },
      { q: "How many usable hosts in a /24 network?", opts: ["254", "255", "256", "252"], ans: 0 },
    ]
  },
  cidr: {
    title: "CIDR — Classless Inter-Domain Routing",
    color: "#f59e0b",
    intro: "CIDR (1993) replaced classful addressing and allows flexible allocation of IP blocks. A CIDR block is written as IP/prefix-length (e.g., 192.168.1.0/24). The prefix length indicates how many bits identify the network.",
    analogy: "CIDR is like custom-sized plot allotments — instead of only large, medium, or small fixed sizes, you can carve out exactly the land you need.",
    sections: [
      {
        heading: "CIDR Notation & Block Sizes",
        content: "The /n prefix specifies how many bits are the network. The remaining (32−n) bits are for hosts. A /30 has 4 addresses (2 usable), a /16 has 65,536. ISPs use CIDR to allocate address space efficiently.",
        formula: "Block size = 2^(32 − prefix)\nUsable hosts = 2^(32 − prefix) − 2\n/24 → 256 addresses, 254 hosts\n/23 → 512 addresses, 510 hosts",
        example: "ISP has 200.10.0.0/16. Assigns: Customer A → 200.10.0.0/24 (256 addrs), Customer B → 200.10.1.0/23 (512 addrs), Customer C → 200.10.4.0/22 (1024 addrs)"
      },
      {
        heading: "Route Aggregation (Supernetting with CIDR)",
        content: "CIDR allows multiple contiguous blocks to be combined into one entry — reducing routing table size. If a router knows all packets to 200.10.0.0/16 go to the same next-hop, it needs one entry instead of 256.",
        formula: "To aggregate n contiguous /k networks:\n- All must share the same first (k−log₂n) bits\n- New prefix = k − log₂n",
        example: "Routes: 200.10.0.0/24, 200.10.1.0/24, 200.10.2.0/24, 200.10.3.0/24\n→ Aggregated to: 200.10.0.0/22 (one entry covers all four!)"
      },
      {
        heading: "Longest Prefix Match",
        content: "When multiple routing table entries match a destination, routers choose the entry with the longest (most specific) prefix. This is fundamental to how CIDR routing works.",
        formula: "For destination D, select route R where:\n- D matches R's network bits AND\n- R has the maximum prefix length among all matching routes",
        example: "Routing table: 192.168.0.0/16 → Router A, 192.168.1.0/24 → Router B\nPacket to 192.168.1.50 → Router B wins (longer prefix /24 beats /16)"
      }
    ],
    quiz: [
      { q: "How many host addresses does a /26 network provide?", opts: ["62", "64", "30", "126"], ans: 0 },
      { q: "What does CIDR replace?", opts: ["VLSM", "Classful addressing", "NAT", "DHCP"], ans: 1 },
      { q: "Longest prefix match selects the route with:", opts: ["Shortest mask", "Longest mask", "Lowest metric", "Highest TTL"], ans: 1 },
    ]
  },
  subnetting: {
    title: "Subnetting",
    color: "#ef4444",
    intro: "Subnetting divides a single large network into smaller sub-networks (subnets). This improves security, performance, and address efficiency. Each subnet has its own network address, broadcast address, and range of usable hosts.",
    analogy: "Subnetting is like dividing a large apartment building (network) into floors (subnets) — residents on the same floor communicate directly; communication between floors goes through the building manager (router).",
    sections: [
      {
        heading: "How Subnetting Works",
        content: "We borrow bits from the host portion of an IP address to create subnet IDs. Each borrowed bit doubles the number of subnets but halves the hosts per subnet. The tradeoff: more subnets vs. more hosts per subnet.",
        formula: "Subnets created = 2ˢ (s = borrowed bits)\nHosts per subnet = 2ʰ − 2 (h = remaining host bits)\nNew mask = Original mask extended by s bits",
        example: "Network: 192.168.1.0/24 — borrow 3 bits:\nSubnets = 2³ = 8\nNew mask = /27 (255.255.255.224)\nHosts per subnet = 2⁵ − 2 = 30"
      },
      {
        heading: "Calculating Subnets",
        content: "The block size (increment) between subnets equals the value of the last network bit in the subnet mask. List subnets by incrementing by the block size. Each subnet: .0 = network, .255 = broadcast (for /24 parent).",
        formula: "Block size = 256 − subnet mask octet value\nSubnet n starts at: Network address + (n × block size)",
        example: "192.168.1.0/27 → mask = 255.255.255.224, block = 256−224 = 32\nSubnet 0: .0 (net) → .1-.30 (hosts) → .31 (bcast)\nSubnet 1: .32 (net) → .33-.62 (hosts) → .63 (bcast)"
      },
      {
        heading: "VLSM (Variable Length Subnet Masking)",
        content: "VLSM allows different subnets within the same network to have different sizes. This maximizes address efficiency. A /30 (2 hosts) is perfect for point-to-point router links; /25 (126 hosts) for a large office.",
        formula: "Always subnet the largest requirement first.\nRound up to nearest power of 2 for each requirement.\nAllocate in decreasing order of size.",
        example: "Network 10.0.0.0/24: Need dept A (60 hosts), dept B (30 hosts), link (2 hosts)\nA: 10.0.0.0/26 (62 hosts), B: 10.0.0.64/27 (30 hosts), Link: 10.0.0.96/30 (2 hosts)"
      }
    ],
    quiz: [
      { q: "You borrow 4 bits from a /24 network. What is the new prefix?", opts: ["/26", "/27", "/28", "/30"], ans: 2 },
      { q: "How many usable hosts does a /30 provide?", opts: ["2", "4", "6", "30"], ans: 0 },
      { q: "What is the block size for a /27 subnet?", opts: ["16", "32", "64", "128"], ans: 1 },
    ]
  },
  supernetting: {
    title: "Supernetting",
    color: "#ec4899",
    intro: "Supernetting (route aggregation) combines multiple contiguous networks into a single larger network entry. This reduces routing table size and is the basis of CIDR. The combined networks must be contiguous and the same size.",
    analogy: "Supernetting is like combining multiple small ZIP codes under a single regional postal code for efficient mail sorting.",
    sections: [
      {
        heading: "When to Supernet",
        content: "Supernetting makes sense when you have multiple contiguous same-size networks all reachable via the same next-hop router. Instead of advertising 4 routes, you advertise one aggregate route — this is called route summarization.",
        formula: "Requirements for supernetting:\n1. Networks must be contiguous\n2. All must be same size (/n)\n3. First network address must be divisible by (number of networks × block size)\n4. New prefix = n − log₂(number of networks)",
        example: "Can we aggregate 200.1.0.0/24 and 200.1.1.0/24?\n→ Same size ✓, contiguous ✓, 200.1.0.0 divisible by 512 ✓\n→ Aggregate: 200.1.0.0/23"
      },
      {
        heading: "Aggregation Algorithm",
        content: "To find the aggregate: convert the first network address to binary, zero out the last (n − log₂k) bits where k is the number of networks, and write the new prefix length.",
        formula: "New network = First_network AND new_mask\nNew prefix = old_prefix − log₂(count)\nNew mask = flip bottom log₂(count) bits to 0",
        example: "Aggregate 4 networks: 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24\n→ New prefix = 24 − 2 = /22\n→ 10.0.0.0/22 covers all four!"
      },
      {
        heading: "Benefits & Drawbacks",
        content: "Benefits: smaller routing tables, less memory/CPU on routers, faster convergence, reduced BGP updates. Drawbacks: if one subnet fails, the whole aggregate still appears reachable — may cause black-holing without careful implementation.",
        formula: "Routing table reduction = (number of routes − 1) entries saved per aggregation\nISP benefit: core routers carry ~900K routes vs millions without aggregation",
        example: "An ISP with 256 customer /24 networks can advertise a single /16 to the internet backbone — 255 fewer routing entries on every internet core router!"
      }
    ],
    quiz: [
      { q: "What does supernetting reduce?", opts: ["IP addresses", "Routing table size", "Bandwidth", "Latency"], ans: 1 },
      { q: "Aggregating 4 /24 networks gives what prefix?", opts: ["/21", "/22", "/23", "/20"], ans: 1 },
      { q: "Which is NOT a requirement for supernetting?", opts: ["Same size networks", "Contiguous blocks", "Same first-hop router", "Different ISPs"], ans: 3 },
    ]
  },
  nat: {
    title: "Network Address Translation (NAT)",
    color: "#06b6d4",
    intro: "NAT allows multiple devices on a private network to share a single public IP address. The NAT device (usually a router) maintains a translation table mapping private IP:port combinations to public IP:port combinations.",
    analogy: "NAT is like a company receptionist — all calls from employees go through one company phone number. The receptionist tracks which internal extension made each call and routes replies back correctly.",
    sections: [
      {
        heading: "How NAT Works",
        content: "When a private host sends a packet, the NAT router replaces the source private IP with its public IP and records the mapping. Incoming replies are matched against the table and forwarded to the correct private host.",
        formula: "Translation table entry: (Private IP, Private Port) ↔ (Public IP, Public Port)\nStatic NAT: 1-to-1 private:public mapping\nDynamic NAT: pool of public IPs shared\nPAT/NAPT: many-to-one (most common)",
        example: "192.168.1.10:5000 → 203.0.113.1:10001\n192.168.1.15:7000 → 203.0.113.1:10002\nBoth appear as 203.0.113.1 to the internet!"
      },
      {
        heading: "PAT (Port Address Translation)",
        content: "PAT (also called NAPT or IP Masquerade) allows thousands of private hosts to share a single public IP by using different port numbers. This is why home routers can connect many devices with one ISP-assigned IP.",
        formula: "Source port remapping ensures uniqueness:\n(10.0.0.1:4500) → (public:10001)\n(10.0.0.2:4500) → (public:10002)\nSame dest port, different source port → unique mapping",
        example: "Your phone, laptop, TV all streaming Netflix simultaneously through your router's single public IP. Router tracks 3 connections via different port numbers in NAT table."
      },
      {
        heading: "NAT Traversal Problems",
        content: "NAT breaks the end-to-end principle of IP. Protocols that embed IP addresses in payload (FTP, SIP/VoIP) need special handling (ALG). Peer-to-peer applications have difficulty as neither peer can accept incoming connections easily.",
        formula: "Solutions: STUN (Session Traversal Utilities for NAT)\nTURN (relay server)\nICE (Interactive Connectivity Establishment)\nUPnP (automatic port forwarding)",
        example: "VoIP call between NAT'd devices: both phones register with a SIP server (public IP). Server facilitates connection via STUN/TURN to punch through NAT."
      }
    ],
    quiz: [
      { q: "What does PAT allow?", opts: ["1-to-1 IP mapping", "Many hosts share one public IP", "Dynamic routing", "IP fragmentation"], ans: 1 },
      { q: "What breaks NAT functionality?", opts: ["TCP", "Protocols embedding IP in payload", "UDP", "ICMP"], ans: 1 },
      { q: "What does the NAT table store?", opts: ["MAC addresses", "DNS records", "Private/Public IP:Port mappings", "Routing metrics"], ans: 2 },
    ]
  },
  arp: {
    title: "ARP — Address Resolution Protocol",
    color: "#84cc16",
    intro: "ARP resolves IP addresses to MAC addresses within a local network. Before sending a frame, a device must know the MAC address of the destination. ARP sends a broadcast asking 'Who has IP X? Tell me your MAC!'",
    analogy: "ARP is like shouting in a room: 'Hey, who is John Smith? Can you come talk to me?' Everyone hears the question, but only John responds with his location.",
    sections: [
      {
        heading: "ARP Operation",
        content: "ARP works in 4 steps: (1) Sender checks ARP cache for target IP. (2) If not found, broadcasts ARP Request to FF:FF:FF:FF:FF:FF. (3) Target device replies with its MAC (unicast). (4) Sender caches the result and sends the data.",
        formula: "ARP Request: Who has IP X? Tell IP Y (source)\nARP Reply: IP X is at MAC M\nARP Cache TTL: typically 20 minutes\nGratuitous ARP: device announces its own IP:MAC",
        example: "PC1 (10.0.0.1) wants to ping PC2 (10.0.0.2):\n1. Check cache — empty\n2. Broadcast: 'Who has 10.0.0.2?'\n3. PC2 replies: '10.0.0.2 is at 00:1A:2B:3C:4D:5E'\n4. PC1 stores this and sends the ping"
      },
      {
        heading: "ARP Cache & Proxy ARP",
        content: "Each device maintains an ARP cache to avoid repeated broadcasts. Entries expire after 20-30 minutes. Proxy ARP allows a router to answer ARP requests on behalf of hosts on different networks — useful when hosts don't know about subnetting.",
        formula: "cache_lookup(ip) → mac | null\ncache_update(ip, mac, timestamp)\nProxy ARP: router answers for IPs beyond local subnet",
        example: "show arp (Cisco) or arp -a (Windows/Linux)\nTypical entry: 192.168.1.1 → 00:50:56:ab:cd:ef [dynamic]\nExpires in: 18 min 32 sec"
      },
      {
        heading: "ARP Vulnerabilities",
        content: "ARP has no authentication — any device can send fake ARP replies. ARP Poisoning/Spoofing sends gratuitous ARPs with wrong MAC, redirecting traffic to the attacker (enabling MITM attacks). Mitigated by Dynamic ARP Inspection (DAI) on managed switches.",
        formula: "Attack: Send 'IP of router = attacker's MAC'\nAll traffic → attacker → (optionally) forward → router\nDetection: IP-MAC binding monitoring\nPrevention: DAI + DHCP snooping",
        example: "Attacker sends: '192.168.1.1 is at AA:BB:CC:DD:EE:FF (attacker's MAC)'\nAll hosts update their ARP cache\nAll traffic meant for gateway now goes through attacker!"
      }
    ],
    quiz: [
      { q: "ARP requests are sent to which MAC address?", opts: ["00:00:00:00:00:00", "FF:FF:FF:FF:FF:FF", "Router's MAC", "Target's MAC"], ans: 1 },
      { q: "What is a Gratuitous ARP?", opts: ["ARP for default gateway", "Device announcing its own IP:MAC", "ARP across subnets", "Encrypted ARP"], ans: 1 },
      { q: "ARP Poisoning enables what attack?", opts: ["DoS", "Port scanning", "Man-in-the-Middle", "IP spoofing"], ans: 2 },
    ]
  },
  dhcp: {
    title: "DHCP — Dynamic Host Configuration Protocol",
    color: "#f97316",
    intro: "DHCP automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts. Without DHCP, every device would need manual IP configuration — imagine doing that for thousands of devices!",
    analogy: "DHCP is like a hotel front desk — when you check in (connect to network), they give you a room number (IP address) to use during your stay (lease time). When you check out, the room becomes available again.",
    sections: [
      {
        heading: "DORA Process",
        content: "DHCP uses a 4-step process: Discover → Offer → Request → Acknowledge. The client uses broadcasts because it has no IP yet. After ACK, the client can communicate on the network with its assigned configuration.",
        formula: "DISCOVER: Client → 255.255.255.255 (broadcast) — 'Anyone offer me an IP?'\nOFFER: Server → 255.255.255.255 — 'I offer 192.168.1.100 for 24h'\nREQUEST: Client → 255.255.255.255 — 'I accept 192.168.1.100'\nACK: Server → Client — 'Confirmed, here's your full config'",
        example: "New laptop connects to WiFi:\n1. Broadcasts DHCPDISCOVER\n2. Router offers 192.168.1.105/24, gateway .1, DNS 8.8.8.8\n3. Laptop accepts with DHCPREQUEST\n4. Router confirms with DHCPACK (lease: 24 hours)"
      },
      {
        heading: "Lease Management",
        content: "DHCP leases are temporary. At 50% of lease time, client tries to renew (unicast to server). At 87.5%, broadcasts renewal request. If expired, starts DORA again. DHCP Inform: client already has IP but wants config parameters.",
        formula: "T1 (renewal) = 0.5 × lease time\nT2 (rebinding) = 0.875 × lease time\nAt T1: unicast DHCPREQUEST to original server\nAt T2: broadcast DHCPREQUEST to any server",
        example: "24-hour lease: T1 = 12h (unicast renewal), T2 = 21h (broadcast rebinding)\nAt 12h: 'Server, can I keep 192.168.1.105?'\nServer: 'Yes, another 24 hours!'"
      },
      {
        heading: "DHCP Relay & Options",
        content: "Normally DHCP only works on one network segment (broadcasts don't cross routers). DHCP Relay Agents (ip helper-address in Cisco) forward DHCP broadcasts to a central DHCP server. DHCP Options provide additional configuration: NTP servers, TFTP servers, boot files, etc.",
        formula: "Key DHCP Options:\nOption 1: Subnet mask\nOption 3: Default gateway\nOption 6: DNS servers\nOption 15: Domain name\nOption 51: Lease time\nOption 82: Relay agent info",
        example: "Enterprise with 100 VLANs: one central DHCP server.\nEach VLAN router interface: ip helper-address 10.0.0.5\nAll DHCP broadcasts forwarded to 10.0.0.5\nServer assigns from correct pool based on relay info."
      }
    ],
    quiz: [
      { q: "What does DORA stand for?", opts: ["Define, Offer, Route, Assign", "Discover, Offer, Request, Acknowledge", "Detect, Offer, Resolve, Authenticate", "Discover, Open, Route, Acknowledge"], ans: 1 },
      { q: "At what point does a DHCP client first try to renew its lease?", opts: ["25% of lease time", "50% of lease time", "75% of lease time", "87.5% of lease time"], ans: 1 },
      { q: "What allows DHCP to work across multiple subnets?", opts: ["DHCP Proxy", "DHCP Relay Agent", "DHCP Multicast", "DHCP Bridge"], ans: 1 },
    ]
  },
  icmp: {
    title: "ICMP — Internet Control Message Protocol",
    color: "#a855f7",
    intro: "ICMP is a support protocol used for sending error messages and operational information. It's not used for data transfer — it tells devices about network problems. ICMP is how 'ping' and 'traceroute' work!",
    analogy: "ICMP is like the postal system's notification service — it sends you a 'return to sender' note when your letter can't be delivered, or a 'post office is closed' notice.",
    sections: [
      {
        heading: "ICMP Message Types",
        content: "Each ICMP message has a Type and Code field. Common types: Echo Request/Reply (ping), Destination Unreachable, Time Exceeded, Redirect, Source Quench (deprecated). Each type has sub-codes for specific conditions.",
        formula: "Type 0: Echo Reply (ping response)\nType 3: Destination Unreachable (codes 0-15)\nType 5: Redirect\nType 8: Echo Request (ping)\nType 11: Time Exceeded (traceroute!)\nType 12: Parameter Problem",
        example: "Type 3, Code 0: Net Unreachable (no route to network)\nType 3, Code 1: Host Unreachable (route exists but host down)\nType 3, Code 3: Port Unreachable (host up, port closed)\nType 3, Code 4: Fragmentation Needed (MTU issue)"
      },
      {
        heading: "Ping & Echo",
        content: "Ping uses ICMP Echo Request (Type 8) and Echo Reply (Type 0). The ping utility sends a sequence of Echo Requests and measures round-trip time. Sequence numbers identify each request/reply pair. TTL in reply shows how many hops away the host is.",
        formula: "RTT = T(reply received) − T(request sent)\nPacket Loss % = (sent − received) / sent × 100\nping -c 4 -s 1400 192.168.1.1\n(-c: count, -s: payload size)",
        example: "ping 8.8.8.8:\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8ms\n→ 118 TTL means ~6 hops away (128−118=10? actually OS-dependent)"
      },
      {
        heading: "Traceroute",
        content: "Traceroute exploits ICMP Time Exceeded messages. It sends packets with TTL=1, 2, 3... Each router that decrements TTL to 0 sends back a Time Exceeded (Type 11). By recording who sends each Time Exceeded, traceroute maps the path!",
        formula: "TTL=1 → Router 1 expires, sends Time Exceeded back\nTTL=2 → Router 2 expires, sends Time Exceeded back\n...\nTTL=n → Destination reached, sends Echo Reply\nEach hop identified by source of ICMP reply",
        example: "traceroute google.com:\n1  192.168.1.1 (home router)  1.2ms\n2  10.0.0.1 (ISP gateway)  8.5ms\n3  72.14.215.1 (Google edge)  12.3ms\n4  8.8.8.8  13.1ms"
      }
    ],
    quiz: [
      { q: "What ICMP type is an Echo Request (ping)?", opts: ["Type 0", "Type 3", "Type 8", "Type 11"], ans: 2 },
      { q: "Traceroute works by exploiting which ICMP message?", opts: ["Echo Reply", "Destination Unreachable", "Redirect", "Time Exceeded"], ans: 3 },
      { q: "ICMP Type 3, Code 3 means?", opts: ["Network unreachable", "Host unreachable", "Port unreachable", "Protocol unreachable"], ans: 2 },
    ]
  },
  routing: {
    title: "Routing Algorithms",
    color: "#14b8a6",
    intro: "Routing algorithms determine the best path for packets to travel from source to destination. The three main categories: Distance Vector (RIP), Link State (OSPF), and Hierarchical routing for large-scale networks.",
    analogy: "Routing algorithms are like GPS navigation: distance vector is asking neighbors for directions (trusting them blindly); link state is having a full map of the city; hierarchical is having regional maps connected by highways.",
    sections: [
      {
        heading: "Distance Vector Routing",
        content: "Each router maintains a table of (destination, distance, next-hop). Routers periodically share their tables with neighbors only. Routers update using Bellman-Ford: if neighbor's path + link cost < current best, update. Simple but slow to converge.",
        formula: "Bellman-Ford: D(x,y) = min over v { cost(x,v) + D(v,y) }\nwhere v = neighbors of x\nRIP: hop count metric, max 15 hops (16 = infinity)\nUpdate interval: 30 seconds, expire: 180s, flush: 240s",
        example: "Router A thinks: 'To reach D, I go through B (cost 3) or C (cost 5). B says D is 2 away. So via B: 1+2=3. Via C: 1+4=5. Best: via B, cost 3.'\nRIP uses this to build routing tables hop-by-hop."
      },
      {
        heading: "Count-to-Infinity Problem",
        content: "Distance vector's fatal flaw: when a link fails, false information propagates slowly and routers keep incrementing metrics believing there's still a path through each other. Solutions: split horizon, poison reverse, triggered updates, hold-down timers.",
        formula: "Split Horizon: Don't advertise a route back to the interface you learned it from\nPoison Reverse: Advertise failed routes with metric = infinity\nHold-down Timer: Ignore updates for a route in hold-down state\nTriggered Updates: Immediately advertise changes",
        example: "A–B–C network. B–C link fails:\nA tells B: 'I can reach C in 2 hops'\nB updates: 'C via A = 3 hops'\nA updates: 'C via B = 4 hops' (B told A!)\n→ Count-to-infinity begins! Solution: split horizon."
      },
      {
        heading: "Link State Routing (OSPF)",
        content: "Each router floods its link state (directly connected neighbors and costs) to ALL routers. Each router builds a complete topology map and runs Dijkstra's algorithm independently. Faster convergence, no count-to-infinity, but more memory/CPU.",
        formula: "Dijkstra's Algorithm:\n1. Start with source node, dist=0\n2. For unvisited node with min distance:\n   - Update neighbors: dist[v] = dist[u] + cost(u,v)\n3. Mark u as visited\n4. Repeat until all visited\nConvergence: O(n²) or O((n+e)log n)",
        example: "OSPF area 0 (backbone): all routers exchange LSAs (Link State Advertisements). Each router has identical LSDB (topology database). Each independently calculates shortest path tree to all destinations using Dijkstra."
      },
      {
        heading: "Hierarchical Routing",
        content: "For very large networks, flat routing (all routers knowing everything) is impractical. Hierarchical routing divides the network into regions/areas. Routers know full topology within their region, only summaries of other regions.",
        formula: "Two-level hierarchy: backbone + regions\nIntra-region: full topology known\nInter-region: only border router addresses\nOptimal region size ≈ √N routers (N total)\nBGP: hierarchical between autonomous systems",
        example: "OSPF hierarchy: Area 0 (backbone) connects Area 1, Area 2, Area 3.\nIntra-area: full LSA flooding\nInter-area: Area Border Routers (ABRs) summarize\nAS boundary: ASBRs redistribute external routes"
      }
    ],
    quiz: [
      { q: "Which algorithm does link state routing use?", opts: ["Bellman-Ford", "Dijkstra's", "Floyd-Warshall", "A*"], ans: 1 },
      { q: "What is RIP's maximum hop count?", opts: ["10", "15", "16", "255"], ans: 1 },
      { q: "Split horizon prevents:", opts: ["Routing loops only", "Count-to-infinity", "LSA flooding", "MTU mismatch"], ans: 1 },
    ]
  }
};

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: `1px dashed ${COLORS.accent}`, cursor: "help" }}>{children}</span>
      {show && (
        <span style={{
          position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
          background: "#1e2d45", color: COLORS.text, padding: "6px 10px", borderRadius: 6,
          fontSize: 12, whiteSpace: "nowrap", zIndex: 100, border: `1px solid ${COLORS.border}`,
          marginBottom: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}>{text}</span>
      )}
    </span>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div style={{ background: "#1a2236", borderRadius: 4, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.0");
  const [prefix, setPrefix] = useState(24);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [showSteps, setShowSteps] = useState(false);

  const calculate = () => {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      setResult({ error: "Invalid IP address" }); return;
    }
    const p = parseInt(prefix);
    if (isNaN(p) || p < 0 || p > 32) { setResult({ error: "Invalid prefix" }); return; }

    const ipNum = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0;
    const maskNum = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
    const networkNum = (ipNum & maskNum) >>> 0;
    const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0;
    const hosts = p >= 31 ? (p === 31 ? 2 : 1) : Math.pow(2, 32 - p) - 2;

    const toIP = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    const toBin = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
      .map(b => b.toString(2).padStart(8, "0")).join(".");

    const binIP = toBin(ipNum);
    const netBits = binIP.replace(/\./g, "").substring(0, p);
    const hostBits = binIP.replace(/\./g, "").substring(p);

    setResult({
      network: toIP(networkNum),
      broadcast: toIP(broadcastNum),
      first: toIP(networkNum + 1),
      last: toIP(broadcastNum - 1),
      mask: toIP(maskNum),
      hosts,
      binIP,
      binMask: toBin(maskNum),
      netBits, hostBits,
      blockSize: Math.pow(2, 32 - p)
    });

    setSteps([
      { label: "IP in Binary", value: toBin(ipNum), highlight: true },
      { label: "Subnet Mask", value: toBin(maskNum) },
      { label: `Network bits (/${p}) highlighted:`, value: `[${netBits}].${hostBits.match(/.{1,8}/g)?.join(".")}` },
      { label: "Network Address (AND operation)", value: `${toIP(networkNum)} (${toBin(networkNum)})` },
      { label: "Broadcast (host bits all 1s)", value: `${toIP(broadcastNum)} (${toBin(broadcastNum)})` },
      { label: "First Usable Host", value: toIP(networkNum + 1) },
      { label: "Last Usable Host", value: toIP(broadcastNum - 1) },
      { label: "Total Usable Hosts", value: `2^${32 - p} - 2 = ${hosts}` },
    ]);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      <h3 style={{ color: COLORS.accent4, marginBottom: "1rem", fontSize: 18, margin: "0 0 1rem" }}>⚙ Interactive Subnet Calculator</h3>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ color: COLORS.textSub, fontSize: 13, display: "block", marginBottom: 4 }}>IP Address</label>
          <input value={ip} onChange={e => setIp(e.target.value)}
            style={{ width: "100%", background: "#0a0e1a", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontSize: 14, fontFamily: "monospace", boxSizing: "border-box" }}
            placeholder="e.g. 192.168.1.0" />
        </div>
        <div style={{ width: 120 }}>
          <label style={{ color: COLORS.textSub, fontSize: 13, display: "block", marginBottom: 4 }}>Prefix Length</label>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: COLORS.accent, fontFamily: "monospace", fontSize: 16 }}>/</span>
            <input type="number" min={0} max={32} value={prefix} onChange={e => setPrefix(e.target.value)}
              style={{ flex: 1, background: "#0a0e1a", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontSize: 14, fontFamily: "monospace" }} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={calculate}
            style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 6, padding: "9px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Calculate
          </button>
        </div>
      </div>

      {result?.error && <div style={{ color: COLORS.accent5, background: "rgba(239,68,68,0.1)", padding: "8px 12px", borderRadius: 6, fontSize: 14 }}>{result.error}</div>}

      {result && !result.error && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: "1rem" }}>
            {[
              { label: "Network Address", val: result.network, color: COLORS.accent3 },
              { label: "Broadcast", val: result.broadcast, color: COLORS.accent5 },
              { label: "Subnet Mask", val: result.mask, color: COLORS.accent2 },
              { label: "First Host", val: result.first, color: COLORS.accent },
              { label: "Last Host", val: result.last, color: COLORS.accent },
              { label: "Usable Hosts", val: result.hosts.toLocaleString(), color: COLORS.accent4 },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "#0a0e1a", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>{label}</div>
                <div style={{ color, fontFamily: "monospace", fontSize: 14, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>

          <button onClick={() => setShowSteps(!showSteps)}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 14px", color: COLORS.textSub, cursor: "pointer", fontSize: 13, marginBottom: "0.75rem" }}>
            {showSteps ? "▼ Hide" : "▶ Show"} Binary Breakdown
          </button>

          {showSteps && (
            <div style={{ background: "#0a0e1a", borderRadius: 8, padding: "1rem", border: `1px solid ${COLORS.border}` }}>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>IP Address (binary)</div>
                <div style={{ fontFamily: "monospace", fontSize: 13 }}>
                  {result.binIP.split("").map((bit, i) => {
                    const idx = i - Math.floor(i / 9);
                    return (
                      <span key={i} style={{ color: bit === "." ? COLORS.textMuted : idx < prefix ? COLORS.accent3 : COLORS.accent5 }}>{bit}</span>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
                  <span style={{ color: COLORS.accent3 }}>■ Network bits ({prefix})</span>
                  {"  "}
                  <span style={{ color: COLORS.accent5 }}>■ Host bits ({32 - prefix})</span>
                </div>
              </div>
              {steps.map((s, i) => (
                <div key={i} style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{s.label} </span>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizSection({ quizData, topicColor }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? quizData.filter((q, i) => answers[i] === q.ans).length : 0;

  return (
    <div style={{ padding: "1.5rem", background: "#0a0e1a", borderRadius: 10, border: `1px solid ${COLORS.border}` }}>
      <h3 style={{ color: topicColor, marginBottom: "1.25rem", margin: "0 0 1.25rem", fontSize: 16 }}>📝 Quick Quiz</h3>
      {quizData.map((q, qi) => (
        <div key={qi} style={{ marginBottom: "1.25rem" }}>
          <div style={{ color: COLORS.text, fontSize: 14, marginBottom: "0.5rem", fontWeight: 500 }}>{qi + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.opts.map((opt, oi) => {
              let bg = "transparent";
              let border = COLORS.border;
              let color = COLORS.textSub;
              if (submitted) {
                if (oi === q.ans) { bg = "rgba(16,185,129,0.15)"; border = COLORS.accent3; color = COLORS.accent3; }
                else if (answers[qi] === oi && oi !== q.ans) { bg = "rgba(239,68,68,0.1)"; border = COLORS.accent5; color = COLORS.accent5; }
              } else if (answers[qi] === oi) { bg = "rgba(0,212,255,0.1)"; border = COLORS.accent; color = COLORS.text; }
              return (
                <button key={oi} onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                  style={{ background: bg, border: `1px solid ${border}`, borderRadius: 6, padding: "7px 14px", color, cursor: submitted ? "default" : "pointer", textAlign: "left", fontSize: 13, transition: "all 0.2s" }}>
                  {["A", "B", "C", "D"][oi]}. {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < quizData.length}
          style={{ background: topicColor, color: "#000", border: "none", borderRadius: 6, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14, opacity: Object.keys(answers).length < quizData.length ? 0.5 : 1 }}>
          Submit Answers
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: score === quizData.length ? COLORS.accent3 : score >= quizData.length / 2 ? COLORS.accent4 : COLORS.accent5, fontSize: 16, fontWeight: 700 }}>
            Score: {score}/{quizData.length} {score === quizData.length ? "🎉 Perfect!" : score >= quizData.length / 2 ? "✓ Good!" : "Try again!"}
          </div>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 14px", color: COLORS.textSub, cursor: "pointer", fontSize: 12 }}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

function TopicPage({ topicId, completed, onComplete }) {
  const data = topicData[topicId];
  const [expanded, setExpanded] = useState({});
  const [showFlash, setShowFlash] = useState(false);
  const [flashIdx, setFlashIdx] = useState(0);

  if (!data) return null;

  const flashCards = data.sections.map(s => ({ front: s.heading, back: s.content.substring(0, 120) + "..." }));

  useEffect(() => { if (!completed.includes(topicId)) onComplete(topicId); }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1rem 4rem" }}>
      <div style={{ padding: "1.5rem 0 1rem", borderBottom: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{topics.find(t => t.id === topicId)?.icon}</span>
          <h1 style={{ color: data.color, margin: 0, fontSize: 24, fontWeight: 700 }}>{data.title}</h1>
        </div>
        <div style={{ background: `${data.color}15`, border: `1px solid ${data.color}30`, borderRadius: 8, padding: "12px 16px" }}>
          <div style={{ color: COLORS.textSub, fontSize: 13, marginBottom: 4 }}>💡 Analogy</div>
          <div style={{ color: COLORS.text, fontSize: 14, fontStyle: "italic" }}>{data.analogy}</div>
        </div>
      </div>

      <div style={{ color: COLORS.text, fontSize: 15, lineHeight: 1.7, marginBottom: "1.5rem" }}>{data.intro}</div>

      {data.sections.map((section, i) => (
        <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, marginBottom: "1rem", overflow: "hidden" }}>
          <button onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))}
            style={{ width: "100%", background: "transparent", border: "none", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ color: data.color, fontWeight: 700, fontSize: 15 }}>{section.heading}</span>
            <span style={{ color: COLORS.textMuted, fontSize: 18 }}>{expanded[i] ? "▼" : "▶"}</span>
          </button>
          {expanded[i] !== false && (
            <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${COLORS.border}` }}>
              <p style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.7, marginTop: 14 }}>{section.content}</p>
              {section.formula && (
                <div style={{ background: "#0a0e1a", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 16px", margin: "10px 0", borderLeft: `3px solid ${COLORS.accent2}` }}>
                  <div style={{ fontSize: 11, color: COLORS.accent2, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>FORMULA / KEY POINTS</div>
                  <pre style={{ color: COLORS.accent, fontFamily: "monospace", fontSize: 12, margin: 0, whiteSpace: "pre-wrap" }}>{section.formula}</pre>
                </div>
              )}
              {section.example && (
                <div style={{ background: `${COLORS.accent3}10`, border: `1px solid ${COLORS.accent3}30`, borderRadius: 8, padding: "12px 16px", margin: "10px 0" }}>
                  <div style={{ fontSize: 11, color: COLORS.accent3, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>EXAMPLE</div>
                  <pre style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 12, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{section.example}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setShowFlash(!showFlash)}
          style={{ background: showFlash ? data.color : "transparent", border: `1px solid ${data.color}`, borderRadius: 6, padding: "7px 16px", color: showFlash ? "#000" : data.color, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          {showFlash ? "📚 Hide Flashcards" : "📚 Show Flashcards"}
        </button>
      </div>

      {showFlash && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ background: COLORS.bgCard, border: `1px solid ${data.color}40`, borderRadius: 12, padding: "2rem", textAlign: "center", minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ color: data.color, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{flashCards[flashIdx].front}</div>
            <div style={{ color: COLORS.textSub, fontSize: 14, lineHeight: 1.6 }}>{flashCards[flashIdx].back}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
            <button onClick={() => setFlashIdx(f => (f - 1 + flashCards.length) % flashCards.length)}
              style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 16px", color: COLORS.textSub, cursor: "pointer" }}>← Prev</button>
            <span style={{ color: COLORS.textMuted, fontSize: 13, alignSelf: "center" }}>{flashIdx + 1}/{flashCards.length}</span>
            <button onClick={() => setFlashIdx(f => (f + 1) % flashCards.length)}
              style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 16px", color: COLORS.textSub, cursor: "pointer" }}>Next →</button>
          </div>
        </div>
      )}

      {topicId === "subnetting" && <SubnetCalculator />}

      <div style={{ marginTop: "1.5rem" }}>
        <QuizSection quizData={data.quiz} topicColor={data.color} />
      </div>
    </div>
  );
}

function HomePage({ onSelect, completed }) {
  const total = topics.length;
  const done = completed.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem 4rem" }}>
      <div style={{ textAlign: "center", padding: "3rem 0 2rem" }}>
        <div style={{ fontSize: 13, color: COLORS.accent, letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Unit II — Internetworking</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, margin: "0 0 1rem", lineHeight: 1.2 }}>
          Network{" "}
          <span style={{ color: COLORS.accent }}>Protocols</span>{" "}
          & Algorithms
        </h1>
        <p style={{ color: COLORS.textSub, fontSize: 16, maxWidth: 540, margin: "0 auto 2rem", lineHeight: 1.7 }}>
          An interactive learning platform covering TCP/IP, routing, addressing, and more — with visualizations, quizzes, and tools.
        </p>
        <div style={{ maxWidth: 400, margin: "0 auto 2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: COLORS.textMuted, fontSize: 13 }}>Overall Progress</span>
            <span style={{ color: COLORS.accent, fontSize: 13, fontWeight: 700 }}>{pct}%</span>
          </div>
          <ProgressBar value={pct} color={COLORS.accent} />
          <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 4 }}>{done} of {total} topics visited</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {topics.map(t => {
          const isDone = completed.includes(t.id);
          return (
            <button key={t.id} onClick={() => onSelect(t.id)}
              style={{ background: COLORS.bgCard, border: `1px solid ${isDone ? t.color + "40" : COLORS.border}`, borderRadius: 12, padding: "18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", position: "relative", overflow: "hidden" }}>
              {isDone && <div style={{ position: "absolute", top: 8, right: 8, background: `${t.color}20`, color: t.color, fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>✓ DONE</div>}
              <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ color: t.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{t.label}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5 }}>
                {topicData[t.id]?.sections.length || 0} sections • Quiz included
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState("home");
  const [completed, setCompleted] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleComplete = (id) => setCompleted(c => c.includes(id) ? c : [...c, id]);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div style={{ position: "sticky", top: 0, background: `${COLORS.bg}ee`, backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}`, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", height: 56, gap: 12 }}>
          <button onClick={() => setSidebarOpen(s => !s)}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 10px", color: COLORS.textSub, cursor: "pointer", fontSize: 18 }}>☰</button>
          <button onClick={() => setCurrent("home")}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: COLORS.accent, fontWeight: 800, fontSize: 16 }}>NetLearn</span>
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>v2.0</span>
          </button>
          <div style={{ flex: 1 }} />
          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{completed.length}/{topics.length} done</div>
          <div style={{ width: 80 }}><ProgressBar value={Math.round(completed.length / topics.length * 100)} color={COLORS.accent} /></div>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ width: sidebarOpen ? 240 : 0, overflow: "hidden", transition: "width 0.3s ease", flexShrink: 0 }}>
          <div style={{ width: 240, paddingTop: "1rem", paddingRight: "0.5rem" }}>
            <div style={{ padding: "6px 12px", marginBottom: 4 }}>
              <button onClick={() => setCurrent("home")} style={{ background: current === "home" ? "rgba(0,212,255,0.1)" : "transparent", border: "none", color: current === "home" ? COLORS.accent : COLORS.textSub, cursor: "pointer", display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 6, fontSize: 13, fontFamily: "inherit" }}>
                🏠 Home
              </button>
            </div>
            {topics.map(t => (
              <div key={t.id} style={{ padding: "2px 12px" }}>
                <button onClick={() => setCurrent(t.id)}
                  style={{ background: current === t.id ? `${t.color}15` : "transparent", border: "none", color: current === t.id ? t.color : COLORS.textSub, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "7px 12px", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}>
                  <span>{t.icon}</span>
                  <span style={{ flex: 1 }}>{t.label}</span>
                  {completed.includes(t.id) && <span style={{ color: t.color, fontSize: 10 }}>✓</span>}
                </button>
              </div>
            ))}
            <div style={{ padding: "2px 12px", marginTop: 8 }}>
              <button onClick={() => setCurrent("tools")}
                style={{ background: current === "tools" ? "rgba(245,158,11,0.1)" : "transparent", border: "none", color: current === "tools" ? COLORS.accent4 : COLORS.textSub, cursor: "pointer", display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontFamily: "inherit" }}>
                ⚙ Subnet Tools
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: "1rem 0" }}>
          {current === "home" && <HomePage onSelect={setCurrent} completed={completed} />}
          {current === "tools" && (
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1rem 4rem" }}>
              <h1 style={{ color: COLORS.accent4, marginBottom: "0.5rem" }}>⚙ Networking Tools</h1>
              <p style={{ color: COLORS.textSub, marginBottom: "1.5rem" }}>Interactive tools for subnetting calculations and binary breakdowns.</p>
              <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
                <SubnetCalculator />
              </div>
              <div style={{ marginTop: "1.5rem", background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "1.5rem" }}>
                <h3 style={{ color: COLORS.accent3, marginBottom: "1rem", margin: "0 0 1rem" }}>CIDR Quick Reference</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        {["Prefix", "Mask", "Addresses", "Hosts", "Block Size"].map(h => (
                          <th key={h} style={{ padding: "6px 12px", color: COLORS.accent, textAlign: "left", fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[8, 16, 17, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(p => {
                        const hosts = Math.pow(2, 32 - p);
                        const m = (0xFFFFFFFF << (32 - p)) >>> 0;
                        const mask = [(m >>> 24) & 255, (m >>> 16) & 255, (m >>> 8) & 255, m & 255].join(".");
                        return (
                          <tr key={p} style={{ borderBottom: `1px solid ${COLORS.border}20` }}>
                            <td style={{ padding: "5px 12px", color: COLORS.accent }}>/{p}</td>
                            <td style={{ padding: "5px 12px", color: COLORS.textSub }}>{mask}</td>
                            <td style={{ padding: "5px 12px", color: COLORS.text }}>{hosts.toLocaleString()}</td>
                            <td style={{ padding: "5px 12px", color: COLORS.accent3 }}>{Math.max(0, hosts - 2).toLocaleString()}</td>
                            <td style={{ padding: "5px 12px", color: COLORS.accent4 }}>{hosts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {topics.map(t => current === t.id && (
            <TopicPage key={t.id} topicId={t.id} completed={completed} onComplete={handleComplete} />
          ))}
        </div>
      </div>
    </div>
  );
}
