import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import './App'; 

const EntryForm = () => {
  const [companyName, setCompanyName] = useState('');
  const [projectName, setProjectName] = useState(''); 
  const [dateOfWork, setDateOfWork] = useState('');
  const [costOfWork, setCostOfWork] = useState('');
  const [valueOfWork, setValueOfWork] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [view, setView] = useState('form');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const companies = ['EOX Vantage', 'Cognizant', 'DXC'];

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('entries'));
    if (storedEntries) {
      setEntries(storedEntries);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { companyName, projectName, dateOfWork, costOfWork, valueOfWork };

    if (editingIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries[editingIndex] = newEntry;
      setEntries(updatedEntries);
      setEditingIndex(null);
    } else {
      setEntries([...entries, newEntry]);
    }

    setCompanyName('');
    setProjectName('');
    setDateOfWork('');
    setCostOfWork('');
    setValueOfWork('');

    saveEntriesToFile([...entries, newEntry]);
  };

  const handleReset = () => {
    setCompanyName('');
    setProjectName('');
    setDateOfWork('');
    setCostOfWork('');
    setValueOfWork('');
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    saveEntriesToFile(updatedEntries);
  };

  const handleEdit = (index) => {
    const entry = entries[index];
    setCompanyName(entry.companyName);
    setProjectName(entry.projectName);
    setDateOfWork(entry.dateOfWork);
    setCostOfWork(entry.costOfWork);
    setValueOfWork(entry.valueOfWork);
    setEditingIndex(index);
    setView('form');
  };

  const saveEntriesToFile = (entries) => {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'entries.json');
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <label>
        Company Name:
        <select
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        >
          <option value="">Select Company</option>
          {companies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Project Name:
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Date of Work:
        <input
          type="date"
          value={dateOfWork}
          onChange={(e) => setDateOfWork(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Cost of Work:
        <input
          type="number"
          value={costOfWork}
          onChange={(e) => setCostOfWork(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Value of Work:
        <input
          type="number"
          value={valueOfWork}
          onChange={(e) => setValueOfWork(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">{editingIndex !== null ? 'Update' : 'Submit'}</button>
      <button type="button" onClick={handleReset}>Reset</button>
    </form>
  );

  const renderEntries = () => {
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);

    return (
      <div className="entry-list">
        <h2>Entered Entries</h2>
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Project Name</th>
              <th>Date of Work</th>
              <th>Cost of Work</th>
              <th>Value of Work</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.companyName}</td>
                <td>{entry.projectName}</td>
                <td>{entry.dateOfWork}</td>
                <td>{entry.costOfWork}</td>
                <td>{entry.valueOfWork}</td>
                <td>
                  <button onClick={() => handleEdit((currentPage-1)*entriesPerPage+index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prevPage => prevPage > 1 ? prevPage - 1 : prevPage)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prevPage => prevPage < Math.ceil(entries.length / entriesPerPage) ? prevPage + 1 : prevPage)}
            disabled={currentPage === Math.ceil(entries.length / entriesPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="entry-form">
      <div className="buttons">
        <button onClick={() => setView('form')}>Form</button>
        <button onClick={() => setView('entries')}>Entries</button>
      </div>

      {view === 'form' && renderForm()}
      {view === 'entries' && renderEntries()}
    </div>
  );
};

export default EntryForm;