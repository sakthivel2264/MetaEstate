import * as THREE from 'three';
import { extend } from '@react-three/fiber';

extend({ PlaneBufferGeometry: THREE.PlaneGeometry });


const Plane = () => {
    return (
        <mesh position={[0, 0, 0]}>
            <planeGeometry  args={[50, 50]} />
            <meshStandardMaterial color={"#404040"} />
        </mesh>
    );
}

export default Plane;