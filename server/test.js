const fetchData = (num) => {
    return new Promise (
        setTimeout(resolve(num ))
    )
}

async function sequentialTasks() {
  console.log("Start");

  // First asynchronous task
  let result1 = await fetchData1(); // Waits for fetchData1() to complete
  console.log('Result 1:', result1);

  // Second asynchronous task
  let result2 = await fetchData2(); // Waits for fetchData2() to complete (after result1)
  console.log('Result 2:', result2);

  // Third asynchronous task
  let result3 = await fetchData3(); // Waits for fetchData3() to complete (after result2)
  console.log('Result 3:', result3);

  console.log("End");
}

