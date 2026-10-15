import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** The original wireframe shell + torus knot + particle field, managed safely by React. */
export default function Scene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (error) {
      // The rest of the page remains fully usable if WebGL is unavailable.
      console.warn('The background 3D scene could not start in this browser.', error);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 7;

    const group = new THREE.Group();
    scene.add(group);

    const shellMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.22 });
    const knotMaterial = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.85 });
    const pointMaterial = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.6, sizeAttenuation: true });

    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.15, 1), shellMaterial);
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.25, 120, 14), knotMaterial);

    const particleCount = window.innerWidth < 640 ? 260 : 520;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 3.2 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, pointMaterial);
    group.add(shell, knot, particles);

    const palette = {
      dark: { accent: '#ff7043', mesh: '#efeee8' },
    };
    const paint = () => {
      const colors = palette.dark;
      shellMaterial.color.set(colors.mesh);
      pointMaterial.color.set(colors.mesh);
      knotMaterial.color.set(colors.accent);
    };

    let width = 1;
    let height = 1;
    let mouseX = 0;
    let mouseY = 0;
    let easedX = 0;
    let easedY = 0;
    let scrollY = window.scrollY;
    let baseY = 0;
    let wide = true;
    let frame = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      wide = width > 860;
      group.scale.setScalar(wide ? 1 : 0.68);
      group.position.x = wide ? 2.55 : 0.25;
      baseY = wide ? 0 : 1.45;
      if (reducedMotion) render(0);
    };

    const render = (time = 0) => {
      easedX += (mouseX - easedX) * 0.045;
      easedY += (mouseY - easedY) * 0.045;
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - height);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / scrollRange));

      group.rotation.y = time * 0.00011 + easedX * 1.1 + scrollProgress * Math.PI * 2;
      group.rotation.x = easedY * 0.75 + scrollProgress * 1.15;
      knot.rotation.x = time * 0.00034;
      knot.rotation.y = time * 0.00026;
      shell.rotation.z = -time * 0.00012;
      particles.rotation.y = -time * 0.00007;
      group.position.y = baseY + scrollProgress * 1.2;
      // The 3D object travels with the reader: hero, work, skills, contact.
      const section = Number(document.documentElement.dataset.section || 0);
      const targetX = wide ? [2.3, -2.7, 2.7, 0][section] ?? 0 : 0.25;
      const targetScale = wide ? [1, 0.85, 0.95, 1.35][section] ?? 1 : 0.68;
      group.position.x += (targetX - group.position.x) * 0.05;
      group.scale.setScalar(group.scale.x + (targetScale - group.scale.x) * 0.05);
      renderer.render(scene, camera);
    };

    const animate = (time) => {
      render(time);
      frame = window.requestAnimationFrame(animate);
    };

    const handlePointer = (event) => {
      mouseX = event.clientX / Math.max(1, width) - 0.5;
      mouseY = event.clientY / Math.max(1, height) - 0.5;
    };
    const handleScroll = () => {
      scrollY = window.scrollY;
      if (reducedMotion) render(0);
    };

    paint();
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (reducedMotion) render(0);
    else frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('scroll', handleScroll);
      shell.geometry.dispose();
      knot.geometry.dispose();
      particleGeometry.dispose();
      shellMaterial.dispose();
      knotMaterial.dispose();
      pointMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="scene-canvas" aria-hidden="true" />;
}
