import React from 'react';

export function Stats() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
        <div className="pageDescription">
            <h3 className="pageTitle"><span className="displayed_username">MyKewlUser687</span>'s Epic Statz</h3>
            <p>Booyah.</p>
        </div>

        <table className="table">
            <tr>
                <td className="statName">Games Played:</td>
                <td className="statValueNum">136</td>
            </tr>
            <tr>
                <td className="statName">Humans Defeated:</td>
                <td className="statValueNum">48</td>
            </tr>
            <tr>
                <td className="statName">DIFFICULT Mode Attempts:</td>
                <td className="statValueNum">35</td>
            </tr>
            <tr>
                <td className="statName">Denials of the Inevitable:</td>
                <td className="statValueNum">14</td>
            </tr>
            <tr>
                <td className="statName">NIMastery:</td>
                <td className="statValueText">Not Yet Achieved</td>
            </tr>
        </table>

        <div></div>
    </main>);
}