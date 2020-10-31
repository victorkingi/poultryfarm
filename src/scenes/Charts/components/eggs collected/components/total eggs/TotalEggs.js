import React from "react";
import {Line} from "react-chartjs-2";

function TotalEggs({eggs}) {

    const eggDataTotal = [];

    const eggsLabel = [];

    let totalMax = 0;

    if (eggs) {
        for (let i = 0; i < eggs['length']; i++) {
            const a1 = parseInt(eggs[i.toString()]["A 1"]);
            const a2 = parseInt(eggs[i.toString()]["A 2"]);
            const b1 = parseInt(eggs[i.toString()]["B 1"]);
            const b2 = parseInt(eggs[i.toString()]["B 2"]);
            const c1 = parseInt(eggs[i.toString()]["C 1"]);
            const c2 = parseInt(eggs[i.toString()]["C 2"]);
            const house = parseInt(eggs[i.toString()]["house"]);
            const total = a1 + a2 + b1 + b2 + c1 + c2 + house;

            if (totalMax < total) {
                totalMax = total;
            }

            eggDataTotal.push(total);
        }

        for (let p = 0; p < eggs['length']; p++) {
            const date = eggs[p.toString()].date.toDate().toLocaleDateString();
            eggsLabel.push(date);

        }

        const eggDataTotaln = eggDataTotal.reverse();

        const eggLabeln = eggsLabel.reverse();

        const totalEggs = {
            labels: eggLabeln,
            datasets: [
                {
                    label: 'Total eggs',
                    data: eggDataTotaln,
                    borderColor: ['rgba(255, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
                }
            ]
        }

        const totalEggsOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Total Eggs against time'
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
                            min: 0,
                            max: totalMax,
                            stepSize: 100
                        }
                    }
                ]
            }
        }

        return (
            <Line data={totalEggs} options={totalEggsOption}/>
        );

    } else {
        return (
            <div/>
        )
    }
}

export default TotalEggs;