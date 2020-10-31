import React from "react";
import {Line} from "react-chartjs-2";

function EachSection({eggs}) {
    const eggsDataA1 = [];
    const eggsDataA2 = [];
    const eggsDataB1 = [];
    const eggsDataB2 = [];
    const eggsDataC1 = [];
    const eggsDataC2 = [];
    const eggsDataHouse = [];
    const eggsDatabroken = [];
    const eggsLabel = [];

    let max = 0;

    if (eggs) {
        for (let i = 0; i < eggs['length']; i++) {
            const a1 = parseInt(eggs[i.toString()]["A 1"]);
            const a2 = parseInt(eggs[i.toString()]["A 2"]);
            const b1 = parseInt(eggs[i.toString()]["B 1"]);
            const b2 = parseInt(eggs[i.toString()]["B 2"]);
            const c1 = parseInt(eggs[i.toString()]["C 1"]);
            const c2 = parseInt(eggs[i.toString()]["C 2"]);
            const house = parseInt(eggs[i.toString()]["house"]);
            const broken = parseInt(eggs[i.toString()]["broken"]);

            if (max < a1) {
                max = a1;
            }
            if (max < a2) {
                max = a2;
            }
            if (max < b1) {
                max = b1;
            }
            if (max < b2) {
                max = b2;
            }
            if (max < c1) {
                max = c1;
            }
            if (max < c2) {
                max = c2;
            }
            if (max < house) {
                max = house;
            }

            eggsDataA1.push(a1);
            eggsDataA2.push(a2);
            eggsDataB1.push(b1);
            eggsDataB2.push(b2);
            eggsDataC1.push(c1);
            eggsDataC2.push(c2);
            eggsDataHouse.push(house);
            eggsDatabroken.push(broken);

        }

        for (let p = 0; p < eggs['length']; p++) {
            const date = eggs[p.toString()].date.toDate().toLocaleDateString();
            eggsLabel.push(date);

        }

        // all data reversed so as to match the graph direction
        const eggsDataA1n = eggsDataA1.reverse();
        const eggsDataA2n = eggsDataA2.reverse();
        const eggsDataB1n = eggsDataB1.reverse();
        const eggsDataB2n = eggsDataB2.reverse();
        const eggsDataC1n = eggsDataC1.reverse();
        const eggsDataC2n = eggsDataC2.reverse();
        const eggsDataHousen = eggsDataHouse.reverse();
        const eggsDatabrokenn = eggsDatabroken.reverse();

        const eggLabeln = eggsLabel.reverse();

        const eachLevel = {
            labels: eggLabeln,
            datasets: [
                {
                    label: 'A 1',
                    data: eggsDataA1n,
                    borderColor: ['rgba(255, 0, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 0, 0, 0.2)'
                },
                {
                    label: 'A 2',
                    data: eggsDataA2n,
                    borderColor: ['rgba(0, 0, 255, 0.2)'],
                    backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
                },
                {
                    label: 'B 1',
                    data: eggsDataB1n,
                    borderColor: ['rgba(255, 69, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
                },
                {
                    label: 'B 2',
                    data: eggsDataB2n,
                    borderColor: ['rgba(34, 139, 34, 0.2)'],
                    backgroundColor: ['rgba(34, 139, 34, 0.2)'],
                    pointBackgroundColor: 'rgba(34, 139, 34, 0.2)'
                },
                {
                    label: 'C 1',
                    data: eggsDataC1n,
                    borderColor: ['rgba(0, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
                },
                {
                    label: 'C 2',
                    data: eggsDataC2n,
                    borderColor: ['rgba(255, 255, 0, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
                },
                {
                    label: 'House',
                    data: eggsDataHousen,
                    borderColor: ['rgba(255, 255, 255, 0.2)'],
                    backgroundColor: ['rgba(255, 255, 255, 0.2)'],
                    pointBackgroundColor: 'rgba(255, 255, 255, 0.2)'
                },
                {
                    label: 'Broken',
                    data: eggsDatabrokenn,
                    borderColor: ['rgba(148, 0, 211, 0.2)'],
                    backgroundColor: ['rgba(148, 0, 211, 0.2)'],
                    pointBackgroundColor: 'rgba(148, 0, 211, 0.2)'
                }
            ]
        }

        const eachLevelEggsOption = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: '#000000',
                text: 'Number of eggs collected against time'
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
                            max: max,
                            stepSize: 20
                        }
                    }
                ]
            }
        }

        return (
            <Line data={eachLevel} options={eachLevelEggsOption}/>
        );
    } else {
        return (
            <div/>
        )
    }
}

export default EachSection;
