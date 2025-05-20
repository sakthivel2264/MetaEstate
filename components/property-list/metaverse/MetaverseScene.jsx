"use client";

import Web3 from 'web3';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, MapControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Button } from '@/components/ui/button';
import Plane from '@/components/metaverse/Plane';
import Plot from '@/components/metaverse/Plot';
import Building from '@/components/metaverse/Building';

import Land from '@/contracts/Land.json';
import Navbar from '@/components/navbar/navBar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { use } from "react"

export default function MetaverseScene({params}) {
	const { id } = use(params);
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState(null);

	// Contract & Contract States
	const [landContract, setLandContract] = useState(null);

	const [cost, setCost] = useState(0);
	const [buildings, setBuildings] = useState(null);
	const [landId, setLandId] = useState(null);
	const [landName, setLandName] = useState(null);
	const [landOwner, setLandOwner] = useState(null);
	const [hasOwner, setHasOwner] = useState(false);

	const loadBlockchainData = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum);
			setWeb3(web3);

			const accounts = await web3.eth.getAccounts();

			if (accounts.length > 0) {
				setAccount(accounts[0]);
			}

			const networkId = await web3.eth.net.getId();

			const land = new web3.eth.Contract(Land.abi, Land.networks[networkId].address);
			setLandContract(land);

			const cost = await land.methods.cost().call();
			setCost(web3.utils.fromWei(cost.toString(), 'ether'));

			const buildings = await land.methods.getBuildings().call();
			setBuildings(buildings);

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0]);
			});

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			});
		}
	};

	useEffect(() => {
		loadBlockchainData();
	}, [account]);

	const buyHandler = async (_id) => {
		try {
			await landContract.methods.mint(_id).send({ from: account, value: '1000000000000000000' });

			const buildings = await landContract.methods.getBuildings().call();
			setBuildings(buildings);

			setLandName(buildings[_id - 1].name);
			setLandOwner(buildings[_id - 1].owner);
			setHasOwner(true);
		} catch (error) {
			window.alert('Error occurred when buying');
		}
	};

	return (
		<div className="w-screen h-screen ">
			<Link href={`/marketplace/${id}`} className="absolute top-18 left-5 z-10">
				<Button variant="outline" className="flex items-center gap-2 bg-transparent text-white flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:text-white">
					<ArrowLeft className="h-4 w-4" /> Back
				</Button>
			</Link>
			<Navbar />
			<Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
				<Suspense fallback={null}>
					<Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />
					<ambientLight intensity={0.5} />

					{/* Load in each cell */}
					<Physics>
						{buildings &&
							buildings.map((building, index) => {
								if (building.owner === '0x0000000000000000000000000000000000000000') {
									return (
										<Plot
											key={index}
											position={[building.posX, building.posY, 0.1]}
											size={[building.sizeX, building.sizeY]}
											landId={index + 1}
											landInfo={building}
											setLandName={setLandName}
											setLandOwner={setLandOwner}
											setHasOwner={setHasOwner}
											setLandId={setLandId}
										/>
									);
								} else {
									return (
										<Building
											key={index}
											position={[building.posX, building.posY, 0.1]}
											size={[building.sizeX, building.sizeY, building.sizeZ]}
											landId={index + 1}
											landInfo={building}
											setLandName={setLandName}
											setLandOwner={setLandOwner}
											setHasOwner={setHasOwner}
											setLandId={setLandId}
										/>
									);
								}
							})}
					</Physics>

					<Plane />
				</Suspense>
				<MapControls />
			</Canvas>

			{landId && (
				<div className="absolute bottom-5 right-5 z-10 w-[350px] h-[250px] p-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg space-y-4">
					<h1 className="text-2xl font-bold text-gray-800">{landName}</h1>

					<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
						<div className="space-y-2">
							<h2 className="text-lg font-semibold text-gray-600">ID</h2>
							<p className="text-gray-800">{landId}</p>
						</div>

						<div className="space-y-2">
							<h2 className="text-lg font-semibold text-gray-600">Owner</h2>
							<p className="text-gray-800 break-words w-[170px]">{landOwner}</p>
						</div>

						{!hasOwner && (
							<div className="space-y-2">
								<h2 className="text-lg font-semibold text-gray-600">Cost</h2>
								<p className="text-indigo-600 font-bold">{`${cost} ETH`}</p>
							</div>
						)}
					</div>

					{!hasOwner && (
						<Button
							onClick={() => buyHandler(landId)}
							className="px-4 py-2 font-semibold text-white flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
						>
							Buy Property
						</Button>
					)}
				</div>
			)}
		</div>
	);
}