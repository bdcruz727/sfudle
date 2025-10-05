import React, { useState, useEffect, useRef } from 'react';
import { Link }  from 'react-router-dom'
import AQPond from '../../assets/locationImages/AQPond.jpg'
import ConvoMall from '../../assets/locationImages/ConvocationMall.jpg'
import DiningCommons from '../../assets/locationImages/DiningCommons.jpg'
import SUB from '../../assets/locationImages/SUB.avif'
import Avocado from '../../assets/locationImages/avocado.jpeg'
import WMC from '../../assets/locationImages/WMC.jpeg'
import ASB from '../../assets/locationImages/asb.jpg'
import NapRoom from '../../assets/locationImages/NapRoom.jpeg'
import Library from '../../assets/locationImages/library.webp'
import Shrum from '../../assets/locationImages/shrum.jpg'
import TransportationCentre from '../../assets/locationImages/transportation.jpeg'
import RCB from '../../assets/locationImages/rcb.jpg'
import SFULogo from '../../assets/sfuLogo.png'



const LocationGuessingGame = () => {
  const locations = [
    { name: "AQ pond", image: AQPond},
    { name: "Convocation Mall", image: ConvoMall},
    { name: "Dining Commons", image: DiningCommons},
    { name: "Student Union Building", image: SUB},
    { name: "The Avocado", image: Avocado},
    { name: "West Mall Centre", image: WMC},
    { name: "Applied Science Building", image: ASB},
    { name: "Nap Room", image: NapRoom},
    { name: "Robert C. Brown Hall", image: RCB},
    { name: "Transportation Centre", image: TransportationCentre},
    { name: "Shrum Science Centre", image: Shrum},
    { name: "WAC Bennet Library", image: Library},
  ];

  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [hiddenBlocks, setHiddenBlocks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [gameDisabled, setGameDisabled] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentPoints, setCurrentPoints] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  
  const intervalRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    startNewRound();
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const totalBlocks = 48;
    const revealedBlocks = hiddenBlocks.length;
    
    // Stay at 100 points for first 6 blocks
    if (revealedBlocks <= 6) {
      setCurrentPoints(100);
    } else {
      // Decrease from 100 to 0 as blocks 7-48 are revealed
      const remainingBlocks = totalBlocks - revealedBlocks;
      const points = Math.round((remainingBlocks / (totalBlocks - 6)) * 100);
      setCurrentPoints(Math.max(0, points));
    }
  }, [hiddenBlocks]);

  const startNewRound = () => {
    setSelectedLocation(null);
    setSearchValue('');
    setResult(null);
    setGameDisabled(false);
    setIsDropdownOpen(false);
    setHiddenBlocks([]);
    setCurrentPoints(100);
    
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setCurrentLocation(randomLocation);
    
    setTimeout(() => {
      startRevealingBlocks();
    }, 100);
  };

  const startRevealingBlocks = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const totalBlocks = 48;
    let remaining = Array.from({ length: totalBlocks }, (_, i) => i);
    
    intervalRef.current = setInterval(() => {
      if (remaining.length === 0) {
        clearInterval(intervalRef.current);
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * remaining.length);
      const blockToHide = remaining[randomIndex];
      remaining.splice(randomIndex, 1);
      
      setHiddenBlocks(prev => [...prev, blockToHide]);
    }, 800);
  };

  const handleSubmit = () => {
    if (!selectedLocation) {
      alert('Please select a location first!');
      return;
    }
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const newTotal = total + 1;
    setTotal(newTotal);
    setGameDisabled(true);
    
    if (selectedLocation === currentLocation.name) {
      const newScore = score + currentPoints;
      setScore(newScore);
      setResult({ correct: true, message: `🎉 Correct! +${currentPoints} points!` });
    } else {
      setResult({ correct: false, message: `❌ Incorrect! It was ${currentLocation.name}` });
    }
    
    // Check if game is over after 6 rounds
    if (newTotal >= 6) {
      setGameOver(true);
    }
    
    setHiddenBlocks(Array.from({ length: 48 }, (_, i) => i));
  };

  const filteredLocations = locations
    .filter(loc => loc.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleLocationSelect = (name) => {
    setSelectedLocation(name);
    setSearchValue(name);
    setIsDropdownOpen(false);
  };



  return (
    <div className="h-screen bg-gradient-to-br from-[#CC0633] to-[#990426] flex flex-col p-8 overflow-y-auto">

        {!gameStarted && !showInstructions ? (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <button
            onClick={() => setShowInstructions(true)}
            className="p-5 text-5xl w-[400px] h-[200px] font-extrabold bg-white text-[#CC0633] rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
            >
                <h1 className='text-4xl'>
                    Start Game
                </h1>
            </button>
        </div>
        ) : showInstructions && !gameStarted ? (
        <div className="flex items-center justify-center mt-10">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl">
              <h1 className="text-4xl font-bold text-[#CC0633] mb-6 text-center">How to Play</h1>
              <div className="text-lg text-gray-800 space-y-4 mb-8">
                <p>
                  When you start, the image will slowly be revealed. As more of the image is revealed, 
                  the potential points for your guess is reduced.
                </p>
                <p>
                  Once the image is fully revealed you will receive 0 points for your guess.
                </p>
                <p>
                    You only get one guess per image, so be careful!
                </p>
                <p className="font-bold text-[#CC0633]">
                  Do your best to guess the locations as fast as possible for a max of 600 points total!
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="flex-1 p-4 text-xl font-bold bg-gray-400 text-white rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
                >
                  Back
                </button>
                <button
                  onClick={() => { 
                    setShowInstructions(false); 
                    setGameStarted(true); 
                    startNewRound(); 
                  }}
                  className="flex-1 p-4 text-xl font-bold bg-[#CC0633] text-white rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
                >
                  Let's Go!
                </button>
              </div>
            </div>
        </div>
        ) : (
        <>
            <div className='flex flex-row items-center justify-center'>
               <img src={SFULogo} alt="SFU Logo" className='h-16 p-4' />
               <h1 className="text-3xl font-bold text-center text-white mb-1">
                   Guess the Location!
               </h1> 
            </div>
            
            <div className="text-center text-base text-white mb-3">
              Score: {score} | Round: {total}/6 | Current Round: {currentPoints} points
            </div>

            <div className="relative w-full max-w-5xl mx-auto h-[60vh] mb-4 rounded-xl overflow-hidden bg-gray-100 shadow-2xl">
              {currentLocation && (
                <img
                  src={currentLocation.image}
                  alt="Location"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-0 left-0 w-full h-full grid grid-cols-8 grid-rows-6">
                {Array.from({ length: 48 }, (_, i) => (
                  <div
                    key={i}
                    className={`bg-black ${
                        hiddenBlocks.includes(i) ? 'opacity-0 transition-opacity duration-700' : 'opacity-100'
                      }`}
                  />
                ))}
              </div>
            </div>

            {result && (
              <div
                className={`text-center p-3 rounded-xl mb-3 text-base font-bold max-w-5xl mx-auto ${
                  result.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {result.message}
              </div>
            )}

            <div className="relative mb-3 max-w-5xl mx-auto w-full" ref={dropdownRef}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(true)}
                placeholder="Search and select a location..."
                disabled={gameDisabled}
                className={`w-full p-3 text-black border-2 outline-none transition-colors bg-white ${
                  isDropdownOpen
                    ? 'border-white rounded-t-xl'
                    : 'border-white rounded-xl'
                } ${gameDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              
              {isDropdownOpen && !gameDisabled && (
                <div className="absolute top-full left-0 right-0 max-h-64 overflow-y-auto border-2 border-t-0 border-white rounded-b-xl bg-white z-10 shadow-lg">
                  {filteredLocations.length === 0 ? (
                    <div className="p-3 text-gray-500">No locations found</div>
                  ) : (
                    filteredLocations.map((location) => (
                      <div
                        key={location.name}
                        onClick={() => handleLocationSelect(location.name)}
                        className={`p-3 cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors ${
                          selectedLocation === location.name
                            ? 'bg-[#CC0633] text-white'
                            : 'hover:bg-gray-100 text-black'
                        }`}
                      >
                        {location.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 max-w-5xl mx-auto w-full">
              {!result ? (
                <button
                  onClick={handleSubmit}
                  disabled={gameDisabled}
                  className="flex-1 p-3 text-base font-bold bg-white text-[#CC0633] rounded-xl transition-transform hover:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  Submit Guess
                </button>
              ) : (
                <button
                  onClick={startNewRound}
                  className="flex-1 p-3 text-base font-bold bg-white text-green-600 rounded-xl transition-transform hover:scale-[0.98] shadow-lg"
                >
                  {total >= 6 ? 'View Final Score' : 'Next Location'}
                </button>
              )}
            </div>
        </>
        )}
        
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
              <p className="text-4xl font-bold text-[#CC0633] mb-4">Game Over!</p>
              <p className="text-2xl mb-2">Final Score</p>
              <p className="text-6xl font-bold text-[#CC0633] mb-6">{score}</p>
              <p className="text-xl mb-6">You completed 6 rounds!</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setScore(0);
                    setTotal(0);
                    setGameOver(false);
                    setGameStarted(false);
                  }}
                  className="p-4 text-xl font-bold bg-[#CC0633] text-black rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
                >
                  Play Again
                </button>
                <Link to="/">
                    <button
                    className="p-4 text-xl font-bold bg-gray-600 text-black rounded-xl shadow-lg hover:scale-[0.98] transition-transform"
                    >
                    Return to Home
                    </button>
                </Link>
                
              </div>
            </div>
          </div>
        )}
    </div>
    
  );
};

export default LocationGuessingGame;