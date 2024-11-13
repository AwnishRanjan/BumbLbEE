import React from 'react';

const SessionSelector = ({ sessions, currentSession, onSelectSession, onNewSession, onDeleteSession }) => {
  return (
    <div className="session-selector">
      <select value={currentSession} onChange={(e) => onSelectSession(e.target.value)}>
        <option value="">Select a session</option>
        {sessions.map((session) => (
          <option key={session} value={session}>
            {session}
          </option>
        ))}
      </select>
      <button onClick={onNewSession}>New Session</button>
      {currentSession && (
        <button onClick={() => onDeleteSession(currentSession)}>Delete Session</button>
      )}
    </div>
  );
};

export default SessionSelector;