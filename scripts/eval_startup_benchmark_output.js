const benchmarkData = require('/home/circleci/benchmarks/com.circleci.samples.todoapp.macrobenchmark-benchmarkData.json')

const COLD_STARTUP_MEDIAN_THRESHOLD_MILIS = 250
const WARM_STARTUP_MEDIAN_THRESHOLD_MILIS = 150
const HOT_STARTUP_MEDIAN_THRESHOLD_MILIS = 100

const coldMetrics = benchmarkData.benchmarks.find(element => element.params.mode === "COLD").metrics.startupMs
const warmMetrics = benchmarkData.benchmarks.find(element => element.params.mode === "WARM").metrics.startupMs
const hotMetrics = benchmarkData.benchmarks.find(element => element.params.mode === "HOT").metrics.startupMs

let err = 0
let coldMsg = `Cold metrics median time - ${coldMetrics.median}ms `
let warmMsg = `Warm metrics median time - ${warmMetrics.median}ms `
let hotMsg = `Hot metrics median time - ${hotMetrics.median}ms `

if(coldMetrics.median > COLD_STARTUP_MEDIAN_THRESHOLD_MILIS){
    err = 1
    console.error(`${coldMsg} ❌ - OVER THRESHOLD ${COLD_STARTUP_MEDIAN_THRESHOLD_MILIS}ms`)
} else {
    console.log(`${coldMsg} ✅`)
}

if(warmMetrics.median > WARM_STARTUP_MEDIAN_THRESHOLD_MILIS){
    err = 1
    console.error(`${warmMsg} ❌ - OVER THRESHOLD ${WARM_STARTUP_MEDIAN_THRESHOLD_MILIS}ms`)
} else {
    console.log(`${warmMsg} ✅`)
}

if(hotMetrics.median > HOT_STARTUP_MEDIAN_THRESHOLD_MILIS){
    err = 1
    console.error(`${hotMsg} ❌ - OVER THRESHOLD ${HOT_STARTUP_MEDIAN_THRESHOLD_MILIS}ms`)
} else {
    console.log(`${hotMsg} ✅`)
}

process.exit(err)
