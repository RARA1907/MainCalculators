'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { differenceInDays, format } from 'date-fns';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const breadcrumbItems = [
  {
    label: 'Day Counter',
    href: '/day-counter',
  },
];

export default function DayCounter() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    
    // Add renderer to DOM
    const container = document.getElementById('counter-3d');
    if (container) {
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
    }

    // Create text geometry for the counter
    const displayNumber = days !== null ? Math.abs(days).toString() : '0';
    const loader = new FontLoader();
    
    // Load font and create 3D text
    loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(displayNumber, {
        font: font,
        size: 5,
        height: 2,
      });

      // Center the text
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox?.max.x - textGeometry.boundingBox?.min.x;
      textGeometry.translate(textWidth ? -textWidth / 2 : 0, -2.5, 0);

      // Create material and mesh
      const textMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a90e2,
        specular: 0x555555,
        shininess: 30 
      });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      scene.add(textMesh);

      // Add lights
      const light1 = new THREE.DirectionalLight(0xffffff, 1);
      light1.position.set(1, 1, 1);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
      light2.position.set(-1, -1, -1);
      scene.add(light2);

      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      // Position camera
      camera.position.z = 20;

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        textMesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    });

    // Cleanup
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [days]);

  const calculateDays = () => {
    try {
      setError('');
      if (!startDate || !endDate) {
        throw new Error('Please select both start and end dates');
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const difference = differenceInDays(end, start);
      setDays(difference);
    } catch (err: any) {
      setError(err.message);
      setDays(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-6">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="space-y-6 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Day Counter</h1>
          <p className="text-muted-foreground mt-2">
            Calculate the number of days between two dates with a 3D visualization
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Select Dates</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <Button onClick={calculateDays} className="w-full">
                  Calculate Days
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section with 3D Counter */}
          <Card className="bg-background">
            <CardHeader>
              <h2 className="text-xl font-semibold">Results</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {days !== null && (
                  <>
                    <div className="text-center">
                      <div id="counter-3d" className="w-[300px] h-[300px] mx-auto" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg">
                        From {formatDate(startDate)} to {formatDate(endDate)}:
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {Math.abs(days)} {Math.abs(days) === 1 ? 'day' : 'days'} {days < 0 ? 'ago' : 'from now'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <Card className="bg-background md:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">About Day Counter</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">How to use:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Select a start date</li>
                    <li>Select an end date</li>
                    <li>Click "Calculate Days" to see the result</li>
                    <li>Watch the 3D counter animation display your result</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Features:</h3>
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>Interactive 3D number display</li>
                    <li>Calculates days between any two dates</li>
                    <li>Shows if the date is in the past or future</li>
                    <li>Formatted date display</li>
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
