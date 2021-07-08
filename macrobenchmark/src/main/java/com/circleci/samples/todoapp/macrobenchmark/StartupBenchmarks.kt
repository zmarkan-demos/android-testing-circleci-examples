package com.circleci.samples.todoapp.macrobenchmark

import android.content.Intent
import androidx.benchmark.macro.CompilationMode
import androidx.benchmark.macro.StartupMode
import androidx.benchmark.macro.StartupTimingMetric
import androidx.benchmark.macro.junit4.MacrobenchmarkRule
import androidx.test.filters.LargeTest
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.runners.Parameterized


const val TARGET_PACKAGE = "com.circleci.samples.todoapp"

fun MacrobenchmarkRule.measureStartup(
    profileCompiled: Boolean,
    startupMode: StartupMode,
    iterations: Int = 3,
    setupIntent: Intent.() -> Unit = {}
) = measureRepeated(
    packageName = TARGET_PACKAGE,
    metrics = listOf(StartupTimingMetric()),
    compilationMode = if (profileCompiled) {
        CompilationMode.SpeedProfile(warmupIterations = 3)
    } else {
        CompilationMode.None
    },
    iterations = iterations,
    startupMode = startupMode
) {
    pressHome()
    val intent = Intent()
    intent.setPackage(TARGET_PACKAGE)
    setupIntent(intent)
    startActivityAndWait(intent)
}

@LargeTest
@RunWith(Parameterized::class)
class StartupBenchmarks(private val startupMode: StartupMode) {

    @get:Rule
    val benchmarkRule = MacrobenchmarkRule()

    @Test
    fun startupMultiple() = benchmarkRule.measureStartup(
        profileCompiled = false,
        startupMode = startupMode,
        iterations = 5
    ) {
        action = "com.circleci.samples.target.STARTUP_ACTIVITY"
    }

    companion object {
        @Parameterized.Parameters(name = "mode={0}")
        @JvmStatic
        fun parameters(): List<Array<Any>> {
            return listOf(StartupMode.COLD, StartupMode.WARM, StartupMode.HOT)
                .map { arrayOf(it) }
        }
    }
}
