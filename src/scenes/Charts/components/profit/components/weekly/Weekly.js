import React from "react";
import {Line} from "react-chartjs-2";

function Weekly({profit}) {

    const profitAmounts = [];

    const profitLabel = [];

    let profitMax = 0;
    let profitMin = 0;

    if (profit) {

        for (let j = 0; j < profit['length']; j++) {
            const _profit = profit[j.toString()].time === 'Weekly' ? parseInt(profit[j.toString()]["profit"]) : false;
            _profit && profitAmounts.push(_profit);
            if (profitMax < _profit) {
                profitMax = _profit;
            }
            if (profitMin > _profit) {
                profitMin = _profit;
            }
        }

        for (let k = 0; k < profit['length']; k++) {
            const profitDate = profit[k.toString()].time === 'Weekly' ? profit[k.toString()].submittedOn.toDate().toLocaleDateString() : false;
            profitDate && profitLabel.push(profitDate);
        }

        const profitAmountsn = profitAmounts.reverse();

        const profitLabeln = profitLabel.reverse();

        const profitData = {
            labels: profitLabeln,
            datasets: [
                {
                    label: 'Profit/Loss',
                    data: profitAmountsn,
                    borderColor: ['rgba(0, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
                }
            ]
        }

        const profitOptions = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Weekly Profit'
            },
            legend: {
                labels: {
                    fontSize: 15,
                    fontColor: '#000000'
                }
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            min: profitMin,
                            max: profitMax,
                            stepSize: 10000
                        }
                    },
                ]
            }
        }

        return (
            <div>
                <Line data={profitData} options={profitOptions}/>
            </div>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default Weekly;