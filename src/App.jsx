import React, { useEffect, useState } from 'react'
import './App.css'
import Die from './components/Die'
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti';

function App()
{
   const [dice, setDice] = useState(allNewDice);
   const [tenzies, setTenzies] = useState(false);

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

      return dice
   }

   function rollDice()
   {
      if(tenzies)
      {
         setDice(allNewDice);
         setTenzies(false);
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
      }
   }, [dice]);

   return (
      <main>
         
         <Confetti
            width={400}
            height={500}
            numberOfPieces={tenzies ? 69 : 0}
         />

         <div className="info">
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click 
                                       each die to freeze it at its current value 
                                       between rolls.</p>   
         </div>

         <div className="dice">
            {diceElements}
         </div>

         <div className="game">
            <input onClick={rollDice} className="roll" type="button" value={tenzies ? "New Game" : "Roll"}></input>
         </div>
      </main>
   )
}

export default App