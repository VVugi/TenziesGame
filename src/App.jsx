import React, { useState } from 'react'
import './App.css'
import Die from './components/Die'

function App()
{
   const [dice, setDice] = useState(allNewDice);

   function allNewDice()
   {
      const dice = [];

      for(let i = 0; i < 10; i++)
      {
         dice[i] = Math.floor(Math.random() * 6) + 1;
      }

      return dice
   }

   function rollDice()
   {
      setDice(allNewDice());
   }

   const diceElements = dice.map(die => <Die number={die} />);

   return (
      <main>
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
            <input onClick={rollDice} className="roll" type="button" value="Roll"></input>
         </div>
      </main>
   )
}

export default App