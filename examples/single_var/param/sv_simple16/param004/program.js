// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 65536;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 65792;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 65536;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 65792;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt28tOwkAUgOG9T9GlJiSlnZk2alxIDHGjJrhg2ZjURRMRF7AyvrtAC7ZlClR6mcK/I2fOtNMLX04y
//PbY9nc++5jPbtqLQC0bBzL2x+rdR6K9/2/ZkGr5/LBIeB9ad9X0ZhW4wDmZObzFDrH5d9axMVGqjKhUV
//2lyhzZXaaLzWZTReaRx1FhmTt+hzGXdT2em4KIjLgrgqiHsF503W82PdPz9YTy/cs8PvWe7qPW00nSu0
//uUKbK7W5UpurtLkqnxs/49FguHrImTu8vrrFzP5ydtGgs2vQ3TUokkF/10xfPzNZ+DB5ObXH18+OZ76O
//k5ll/hAXNtiADdjUis3xnvwNbh5Qv35qNGctDRDQAA3QmFDVlIRm8yCcJqERQAM0QGM6NMcWLW0z42pf
//obrwcZUHP/ADPybWObIVgCTUQA3UnFOlIw2qdOrix1NKABAAAZABO1XbOm1urNskQQpswAZsOr9TVara
//aYcafbUDQAAEQN2vdg7YpGobIAFAAARA3QXouM0rM+ufplHyr11QAiVQaqkqkqaxJAEIgADoTKoi2Y2q
//qFmU0h8gOoAESIDUtf6t7cEUZ//v3srFk2Pu7+kCGqABmtPr3aqCmYM7t/bjAzMwAzOn17lVLTMCZmAG
//ZujbaqqWqZ+ebCsF+IAP+HSsa6tafiTQAA3Q0LPVRpVTFz75TwjhB37gp2MdW9UCpKAGaqCGfq12Kh34
//gR/4oVur0T0r+IEf+KFXy6C9rCZIyjZKQBIkQVKnOrXq2+GCH/iBH/q0DNr3qpKkX8epbgQ=
