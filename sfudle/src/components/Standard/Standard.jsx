import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDetailsGuess } from '../common/getCourseDetails.js';
import sfuLogo from '../../assets/sfuLogo.png';
import mascot from '../../assets/mascot.png';

function Standard() {
  const [dept, setDept] = useState(''); // state to store input value
  const [number, setNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    try {
      const det = await getDetailsGuess(dept, number); // async call inside handler
      printDetails(det);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };




  function printDetails(det){
    var fac = det.faculty;
    var dept = det.dept;
    var num = det.number;
    var quant = det.designations.quantitative;
    var writ = det.designations.writing;
    var hum = det.designations.humanities;
    var soc = det.designations.social;
    var sci = det.designations.science;

    alert(`faculty: ${fac}
           dept: ${dept}
           number: ${num}
           quantitative: ${quant}
           writing: ${writ}
            humanities: ${hum}
            social: ${soc}
            science: ${sci}`);

  }







  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={dept} 
        onChange={(e) => setDept(e.target.value)}
        placeholder="Department" 
      />
      <input 
        type="text" 
        value={number} 
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Course Number" 
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Standard;
