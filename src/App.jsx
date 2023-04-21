import React, { useEffect, useState } from 'react'
import './App.css'
import Die from './components/Die'
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti';

function App()
{
   const [rolls, setRolls] = useState(0);
   const [time, setTime] = useState(0);
   const [scores, setScores] = useState(
      () => JSON.parse(localStorage.getItem("scores")) || []
   );

   const [dice, setDice] = useState(allNewDice);
   const [tenzies, setTenzies] = useState(false);

   React.useEffect(() => {
      localStorage.setItem("scores", JSON.stringify(scores))
   }, [scores])

   // localStorage.clear();

   function allNewDice()
   {
      const dice = [];

      for(let i = 0; i < 10; i++)
      {
         const die = {};

         die.number = Math.floor(Math.random() * 6) + 1;
         die.isHeld = false;
         die.id = nanoid();

         dice.push(die);
      }

      return dice;
   }

   function rollDice()
   {
      if(tenzies)
      {
         setRolls(1);
         setDice(allNewDice);
         setTenzies(false);
         setTime(0);
      }
      else
      {
         setDice(dice.map(die => {
            let newDie = {};
            
            if(!die.isHeld)
            {
               newDie = {...die, number: Math.floor(Math.random() * 6) + 1};
            }
            else
            {
               newDie = die;
            }
            
            return newDie;
         }));
         
         if(dice.some(die => die.isHeld))
         {
            setRolls(rolls + 1);
         }
         else
         {
            setRolls(1);
            setTime(0);
         }
      }
   }

   function toggle(key)
   {
      setDice(dice.map(die => {
         let newDie = {};
         
         if(die.id == key)
         {
            newDie = {...die, isHeld: !die.isHeld};
         }
         else
         {
            newDie = die;
         }
         
         return newDie;
      }));
   }

   const diceElements = dice.map(die => 
      <Die
         isHeld={die.isHeld}
         number={die.number}
         key={die.id}
         toggle={() => toggle(die.id)}
      />
   );

   useEffect(() => {
      if(dice.every(die => die.isHeld) && dice.every(die => die.number == dice[0].number))
      {
         setTenzies(true);

         let newScore = {
            score: rolls,
            time: time
         };

         setScores(prevScores => [newScore, ...prevScores]);
      }
   }, [dice]);

   useEffect(() => { // A bit wonky when resetting but hey, it works
      let interval;
      
      if(!tenzies)
      {
         interval = setInterval(function() {
            setTime(oldTime => {
               if(tenzies)
               {
                  clearInterval(interval);
               }

               return oldTime + 1;
            });
         }, 1000);  
      }

      return () => clearInterval(interval);
   }, [tenzies]);

   const orderedRecords = [...scores];
   orderedRecords.sort((a, b) => a.score - b.score);

   const scoresList = orderedRecords.map(score => 
      <h4 className="score-item">Score: {score.score} Time: {new Date(score.time * 1000).toISOString().slice(14, 19)}</h4>
   );

   return (
      <main>
         <div className="game">
            <Confetti
               width={565}
               height={445}
               numberOfPieces={tenzies ? 69 : 0} // For the 'fade-out' effect
            />

            <div className="info">
               <h1 className="title">Tenzies</h1>
               <p className="instructions">Roll until all dice are the same. Click 
                                          each die to freeze it at its current value 
                                          between rolls.</p>   
            </div>

            <div className="scores">
               <h4 className="score">Score: {rolls}</h4>
               <h4 className="time">Time: {new Date(time * 1000).toISOString().slice(14, 19)}</h4>
            </div>

            <div className="dice">
               {diceElements}
            </div>

            <div className="game">
               <input onClick={rollDice} className="roll" type="button" value={tenzies ? "New Game" : "Roll"}></input>
            </div>
         </div>

         <div className="highscores">
            <div className="stats">
               <h3>Scores</h3>
               <hr className='divition'/>
               
               <div className="list">
                  {scoresList}
               </div>
            </div>
         </div>
      </main>
   )
}

export default App