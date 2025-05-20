
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

extend({ PlaneBufferGeometry: THREE.PlaneGeometry });

const Plot = ({ position, size, landId, landInfo, setLandName, setLandOwner, setHasOwner, setLandId }) => {
    const clickHandler = () => {
        setLandName(landInfo.name)
        setLandId(landId)

        if (landInfo.owner === '0x0000000000000000000000000000000000000000') {
            setLandOwner('No Owner')
            setHasOwner(false)
        } else {
            setLandOwner(landInfo.owner)
            setHasOwner(true)
        }
    }

    return (
        <mesh position={position} onClick={clickHandler}>
            <planeGeometry args={size} />
            <meshStandardMaterial color={"#11E169"} metalness={50} roughness={0.5} />
        </mesh>
    );
}

export default Plot;