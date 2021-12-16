import * as it from "itertools";
import * as path from "path";

import { readInput } from "../util";

type Packet = {
  version: number;
  typeId: number;
  value: number;
  subpackets: Packet[];
  size: number;
}

const INPUT_PATH = path.join(__dirname, "./input.txt");

function hexToBinaryString(input: string) {
  let out = "";
  for (let c of input) {
    switch (c) {
      case '0': out += "0000"; break;
      case '1': out += "0001"; break;
      case '2': out += "0010"; break;
      case '3': out += "0011"; break;
      case '4': out += "0100"; break;
      case '5': out += "0101"; break;
      case '6': out += "0110"; break;
      case '7': out += "0111"; break;
      case '8': out += "1000"; break;
      case '9': out += "1001"; break;
      case 'A': out += "1010"; break;
      case 'B': out += "1011"; break;
      case 'C': out += "1100"; break;
      case 'D': out += "1101"; break;
      case 'E': out += "1110"; break;
      case 'F': out += "1111"; break;
      default: return "";
    }
  }
  return out;
}

function parseHeader(packet: string, offset: number) {
  const version = Number.parseInt(packet.slice(offset, offset + 3), 2);
  const typeId = Number.parseInt(packet.slice(offset + 3, offset + 6), 2);
  return {version, typeId};
}

function parseLengthTypeId(packet: string, offset: number): {lengthTypeId: number, offsetLength: number} {
  let lengthTypeId = Number.parseInt(packet[offset], 2);
  if (lengthTypeId === 0) {
    return {lengthTypeId, offsetLength: 15}
  } else {
    return {lengthTypeId, offsetLength: 11}
  }
}

function parsePacketByBits(packet: string, offset: number, bitLength: number): Packet[] {
  let subpackets: Packet[] = [];
  let bitsUsed = 0;

  while (bitsUsed < bitLength && offset < packet.length) {
    let subpacket = parsePacket(packet, offset);
    subpackets.push(subpacket);
    bitsUsed += subpacket.size;
    offset += subpacket.size;
  }

  return subpackets;
}

function parsePacketByCount(packet: string, offset: number, packetCount: number): Packet[] {
  let subpackets: Packet[] = [];

  for (let _ of it.range(packetCount)) {
    let subpacket = parsePacket(packet, offset);
    subpackets.push(subpacket);
    offset += subpacket.size;
  }

  return subpackets;
}

function getPacketValue(typeId: number, subpackets: Packet[]): number {
  switch (typeId) {
    case 0: return subpackets.reduce((sum, p) => sum + p.value, 0);
    case 1: return subpackets.reduce((prod, p) => prod * p.value, 1);
    case 2: return Math.min(...subpackets.map((p) => p.value));
    case 3: return Math.max(...subpackets.map((p) => p.value));
    case 5: return subpackets[0].value > subpackets[1].value ? 1 : 0;
    case 6: return subpackets[0].value < subpackets[1].value ? 1 : 0;
    case 7: return subpackets[0].value === subpackets[1].value ? 1 : 0;
    default:
      throw new Error(`Unknown type id ${typeId}`);
  }
}

function parseOperatorPacket(packet: string, offset: number): Packet {
  let baseOffset = offset;
  const { version, typeId } = parseHeader(packet, offset);
  offset += 6; // For version, typeId
  const {lengthTypeId, offsetLength} = parseLengthTypeId(packet, offset);
  offset += 1; // For lengthTypeId
  const count = Number.parseInt(packet.slice(offset, offset + offsetLength), 2);
  offset += offsetLength; // For offsetLength (11 or 15 bits)

  const subpackets = lengthTypeId === 0
    ? parsePacketByBits(packet, offset, count)
    : parsePacketByCount(packet, offset, count);
  offset += it.sum(subpackets.map(p => p.size)); // For subpackets length

  
  const value = getPacketValue(typeId, subpackets);
  const size = offset - baseOffset;
  return { version, typeId, value, subpackets, size };
}

function parseLiteralPacket(packet: string, offset: number): Packet {
  const { version, typeId } = parseHeader(packet, offset);
  offset += 6;

  let chunk: string;
  let binaryString = "";

  while (true) {
    chunk = packet.slice(offset, offset + 5);
    binaryString += chunk.slice(1);
    offset += 5;

    if (chunk[0] === "0") break;
  }

  const size = 6 + (binaryString.length / 4) * 5;
  const value = Number.parseInt(binaryString, 2);
  return {version, typeId, size, value, subpackets: []};
}

function parsePacket(packet: string, offset: number = 0): Packet {
  const typeId = Number.parseInt(packet.slice(offset + 3, offset + 6), 2);

  return typeId === 4
    ? parseLiteralPacket(packet, offset)
    : parseOperatorPacket(packet, offset);
}

function solve(line: string) {
  const packet = parsePacket(hexToBinaryString(line));
  return packet.value;
}

export default async function run() {
  const input = await readInput(INPUT_PATH);
  return solve(input);
}
