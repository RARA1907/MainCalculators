'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { motion } from 'framer-motion';

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binarySubnetMask: string;
  cidr: number;
  class: string;
  type: string;
}

export default function IPSubnetCalculator() {
  const breadcrumbItems = [
    {
      label: 'IP Subnet Calculator',
      href: '/ip-subnet-calculator'
    }
  ];

  const [ipAddress, setIpAddress] = useState<string>('192.168.1.0');
  const [cidr, setCidr] = useState<number>(24);
  const [subnetInfo, setSubnetInfo] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState<string>('');

  const isValidIPv4 = (ip: string): boolean => {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255 && !isNaN(num);
    });
  };

  const isValidCIDR = (cidr: number): boolean => {
    return cidr >= 0 && cidr <= 32;
  };

  const convertToBinary = (num: number): string => {
    return num.toString(2).padStart(8, '0');
  };

  const convertToDecimal = (binary: string): number => {
    return parseInt(binary, 2);
  };

  const getIPClass = (firstOctet: number): string => {
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)';
    return 'Invalid';
  };

  const getIPType = (ip: string): string => {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (ip === '0.0.0.0') return 'This Network';
    if (ip === '127.0.0.1') return 'Loopback';
    if (firstOctet === 10) return 'Private (Class A)';
    if (firstOctet === 172 && parseInt(ip.split('.')[1], 10) >= 16 && parseInt(ip.split('.')[1], 10) <= 31) 
      return 'Private (Class B)';
    if (firstOctet === 192 && parseInt(ip.split('.')[1], 10) === 168) return 'Private (Class C)';
    if (firstOctet === 169 && parseInt(ip.split('.')[1], 10) === 254) return 'Link-Local';
    return 'Public';
  };

  const calculateSubnet = () => {
    if (!isValidIPv4(ipAddress)) {
      setError('Invalid IP address format');
      return;
    }

    if (!isValidCIDR(cidr)) {
      setError('Invalid CIDR notation (must be between 0 and 32)');
      return;
    }

    setError('');

    // Convert IP to binary
    const ipParts = ipAddress.split('.').map(part => parseInt(part, 10));
    const ipBinary = ipParts.map(part => convertToBinary(part)).join('');

    // Create subnet mask in binary
    const subnetMaskBinary = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
    const subnetMaskParts = [
      subnetMaskBinary.slice(0, 8),
      subnetMaskBinary.slice(8, 16),
      subnetMaskBinary.slice(16, 24),
      subnetMaskBinary.slice(24, 32)
    ].map(binary => convertToDecimal(binary));

    // Calculate wildcard mask
    const wildcardMaskParts = subnetMaskParts.map(part => 255 - part);

    // Calculate network address
    const networkBinary = ipBinary.slice(0, cidr) + '0'.repeat(32 - cidr);
    const networkParts = [
      networkBinary.slice(0, 8),
      networkBinary.slice(8, 16),
      networkBinary.slice(16, 24),
      networkBinary.slice(24, 32)
    ].map(binary => convertToDecimal(binary));

    // Calculate broadcast address
    const broadcastBinary = ipBinary.slice(0, cidr) + '1'.repeat(32 - cidr);
    const broadcastParts = [
      broadcastBinary.slice(0, 8),
      broadcastBinary.slice(8, 16),
      broadcastBinary.slice(16, 24),
      broadcastBinary.slice(24, 32)
    ].map(binary => convertToDecimal(binary));

    // Calculate first and last usable hosts
    const firstHostParts = [...networkParts];
    const lastHostParts = [...broadcastParts];
    
    if (cidr < 31) {
      firstHostParts[3] += 1;
      lastHostParts[3] -= 1;
    }

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    setSubnetInfo({
      networkAddress: networkParts.join('.'),
      broadcastAddress: broadcastParts.join('.'),
      firstUsableHost: firstHostParts.join('.'),
      lastUsableHost: lastHostParts.join('.'),
      totalHosts,
      usableHosts,
      subnetMask: subnetMaskParts.join('.'),
      wildcardMask: wildcardMaskParts.join('.'),
      binarySubnetMask: subnetMaskBinary,
      cidr,
      class: getIPClass(ipParts[0]),
      type: getIPType(ipAddress)
    });
  };

  useEffect(() => {
    calculateSubnet();
  }, [ipAddress, cidr]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-6">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-3xl font-bold pt-4 text-base-content">IP Subnet Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Network Parameters</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">IP Address</span>
                  </label>
                  <Input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="e.g., 192.168.1.0"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">CIDR Notation</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={cidr}
                      onChange={(e) => setCidr(parseInt(e.target.value) || 0)}
                      min="0"
                      max="32"
                      placeholder="e.g., 24"
                    />
                    <span>/{cidr}</span>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 mt-2">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {subnetInfo && (
            <Card className="bg-card">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Subnet Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Network Class</h3>
                    <p>{subnetInfo.class}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">IP Type</h3>
                    <p>{subnetInfo.type}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Subnet Mask</h3>
                    <p>{subnetInfo.subnetMask}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Wildcard Mask</h3>
                    <p>{subnetInfo.wildcardMask}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Network Address</h3>
                    <p>{subnetInfo.networkAddress}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Broadcast Address</h3>
                    <p>{subnetInfo.broadcastAddress}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">First Usable Host</h3>
                    <p>{subnetInfo.firstUsableHost}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Last Usable Host</h3>
                    <p>{subnetInfo.lastUsableHost}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Total Hosts</h3>
                    <p>{subnetInfo.totalHosts.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Usable Hosts</h3>
                    <p>{subnetInfo.usableHosts.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Section */}
        <div className="mt-8">
          <Card className="bg-card">
            <CardHeader>
              <h2 className="text-2xl font-semibold">IP Addressing Guide</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">IP Classes</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Class A: 1.0.0.0 to 126.255.255.255</li>
                    <li>Class B: 128.0.0.0 to 191.255.255.255</li>
                    <li>Class C: 192.0.0.0 to 223.255.255.255</li>
                    <li>Class D: 224.0.0.0 to 239.255.255.255</li>
                    <li>Class E: 240.0.0.0 to 255.255.255.255</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Private IP Ranges</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>10.0.0.0 to 10.255.255.255</li>
                    <li>172.16.0.0 to 172.31.255.255</li>
                    <li>192.168.0.0 to 192.168.255.255</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Special Addresses</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Loopback: 127.0.0.1</li>
                    <li>Link-Local: 169.254.0.0/16</li>
                    <li>Multicast: 224.0.0.0/4</li>
                    <li>Broadcast: 255.255.255.255</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
