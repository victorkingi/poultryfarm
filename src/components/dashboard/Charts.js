import React from "react";
import {Line} from "react-chartjs-2";

function Charts(eggs) {

    const eggsDataA1 = [];
    const eggsDataA2 = [];
    const eggsDataB1 = [];
    const eggsDataB2 = [];
    const eggsDataC1 = [];
    const eggsDataC2 = [];
    const eggsDatabroken = [];

    const eggsLabel = [];
    const eggsLabelPercent = [];


    if (eggs.eggs) {
        for (var i = 0; i < eggs.eggs['length']; i++) {
            const a1 = parseInt(eggs.eggs[i.toString()]["A 1"]);
            const a2 = parseInt(eggs.eggs[i.toString()]["A 2"]);
            const b1 = parseInt(eggs.eggs[i.toString()]["B 1"]);
            const b2 = parseInt(eggs.eggs[i.toString()]["B 2"]);
            const c1 = parseInt(eggs.eggs[i.toString()]["C 1"]);
            const c2 = parseInt(eggs.eggs[i.toString()]["C 2"]);
            const broken = parseInt(eggs.eggs[i.toString()]["broken"]);

            eggsDataA1.push(a1);
            eggsDataA2.push(a2);
            eggsDataB1.push(b1);
            eggsDataB2.push(b2);
            eggsDataC1.push(c1);
            eggsDataC2.push(c2);
            eggsDatabroken.push(broken);

        }

        for (var p = 0; p < eggs.eggs['length']; p++) {
            const date = eggs.eggs[p.toString()].date.toDate().toLocaleDateString();
            eggsLabel.push(date);

            if (eggs.eggs[p.toString()].date.toDate().getDay() === 1) {
                const myDate = eggs.eggs[p.toString()].date.toDate().toLocaleDateString();
                eggsLabelPercent.push(myDate);
            }
        }
    }

    const data1 = {
        labels: eggsLabel,
        datasets: [
            {
                label: 'A 1',
                data: eggsDataA1,
                borderColor: ['rgba(255, 0, 0, 0.2)'],
                backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 0, 0, 0.2)'
            },
            {
                label: 'A 2',
                data: eggsDataA2,
                borderColor: ['rgba(0, 0, 255, 0.2)'],
                backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
            },
            {
                label: 'B 1',
                data: eggsDataB1,
                borderColor: ['rgba(255, 69, 0, 0.2)'],
                backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
            },
            {
                label: 'B 2',
                data: eggsDataB2,
                borderColor: ['rgba(34, 139, 34, 0.2)'],
                backgroundColor: ['rgba(34, 139, 34, 0.2)'],
                pointBackgroundColor: 'rgba(34, 139, 34, 0.2)'
            },
            {
                label: 'C 1',
                data: eggsDataC1,
                borderColor: ['rgba(0, 255, 0, 0.2)'],
                backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
            },
            {
                label: 'C 2',
                data: eggsDataC2,
                borderColor: ['rgba(255, 255, 0, 0.2)'],
                backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
            },
            {
                label: 'Broken',
                data: eggsDatabroken,
                borderColor: ['rgba(148, 0, 211, 0.2)'],
                backgroundColor: ['rgba(148, 0, 211, 0.2)'],
                pointBackgroundColor: 'rgba(148, 0, 211, 0.2)'
            }
        ]
    }

    const data2 = {
        labels: eggsLabelPercent,
        datasets: [
            {
                label: 'A 1',
                data: eggsDataA1,
                borderColor: ['rgba(255, 0, 0, 0.2)'],
                backgroundColor: ['rgba(255, 0, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 0, 0, 0.2)'
            },
            {
                label: 'A 2',
                data: eggsDataA2,
                borderColor: ['rgba(0, 0, 255, 0.2)'],
                backgroundColor: ['rgba(0, 0, 255, 0.2)'],
                pointBackgroundColor: 'rgba(0, 0, 255, 0.2)'
            },
            {
                label: 'B 1',
                data: eggsDataB1,
                borderColor: ['rgba(255, 69, 0, 0.2)'],
                backgroundColor: ['rgba(255, 69, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 69, 0, 0.2)'
            },
            {
                label: 'B 2',
                data: eggsDataB2,
                borderColor: ['rgba(34, 139, 34, 0.2)'],
                backgroundColor: ['rgba(34, 139, 34, 0.2)'],
                pointBackgroundColor: 'rgba(34, 139, 34, 0.2)'
            },
            {
                label: 'C 1',
                data: eggsDataC1,
                borderColor: ['rgba(0, 255, 0, 0.2)'],
                backgroundColor: ['rgba(0, 255, 0, 0.2)'],
                pointBackgroundColor: 'rgba(0, 255, 0, 0.2)'
            },
            {
                label: 'C 2',
                data: eggsDataC2,
                borderColor: ['rgba(255, 255, 0, 0.2)'],
                backgroundColor: ['rgba(255, 255, 0, 0.2)'],
                pointBackgroundColor: 'rgba(255, 255, 0, 0.2)'
            },
            {
                label: 'Broken',
                data: eggsDatabroken,
                borderColor: ['rgba(148, 0, 211, 0.2)'],
                backgroundColor: ['rgba(148, 0, 211, 0.2)'],
                pointBackgroundColor: 'rgba(148, 0, 211, 0.2)'
            }
        ]
    }

    const options1 = {
        title: {
            display: true,
            text: 'Number of eggs collected against time'
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 20
                    }
                }
            ]
        }
    }

    const options2 = {
        title: {
            display: true,
            text: 'Weekly Laying Percentage'
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 20
                    }
                }
            ]
        }
    }

    return (
        <div>
            <Line data={data1} options={options1}/>

            <Line data={data2} options={options2}/>
        </div>
    );
}

export default Charts;