import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Packet = {
  version: number;
  typeId: number;
  value: number;
  subpackets: Packet[];
  remainder: string;
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

function parsePacket(packet: string): Packet {
  const version = Number.parseInt(packet.slice(0, 3), 2);
  const typeId = Number.parseInt(packet.slice(3, 6), 2);
  const subpackets: Packet[] = [];
  let remainder = packet.slice(6);

  // console.log({ packet, version, typeId });

  let value = -1;
  switch (typeId) {
    case 4: {
      let done = false;
      let bitString = packet.slice(6);
      let binaryString = "";
      while (!done) {
        if (bitString[0] === "0") done = true;

        binaryString += bitString.slice(1, 5);
        bitString = bitString.slice(5);
      }

      value = Number.parseInt(binaryString, 2);
      remainder = packet.slice(6 + (binaryString.length / 4 * 5));

      break;
    }
    default: {
      const lengthTypeId = Number.parseInt(packet[6], 2);
      if (lengthTypeId === 0) {
        let bitLength = Number.parseInt(packet.slice(7, 22), 2);
        let bitsUsed = 0;
        remainder = packet.slice(22);

        while (bitsUsed < bitLength) {
          let subpacket = parsePacket(remainder);
          bitsUsed += remainder.length - subpacket.remainder.length;
          remainder = subpacket.remainder;

          subpackets.push(subpacket);
        }
      } else {
        let packetCount = Number.parseInt(packet.slice(7, 18), 2);
        let packetsUsed = 0;
        remainder = packet.slice(18);

        while (packetsUsed < packetCount) {
          let subpacket = parsePacket(remainder);
          packetsUsed += 1;
          remainder = subpacket.remainder;

          subpackets.push(subpacket);
        }
      }
    }
  }

  return {version, typeId, value, subpackets, remainder };
}

function parse(lines: string[]) {
  return lines
    .map(hexToBinaryString)
    .map(parsePacket);
}

function sumVersion(packet: Packet, sum: number = 0) {
  let newSum = sum + packet.version;
  for (let subpacket of packet.subpackets) {
    newSum += sumVersion(subpacket);
  }

  return newSum;
}

function solve(lines: string[]) {
  const packets = parse(lines);
  const sums = packets.map(packet => sumVersion(packet));
  return it.sum(sums);
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
