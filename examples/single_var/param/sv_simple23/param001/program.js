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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3M1r2zAYx/H7/gofNwjzmyzBSg8rpeyyDbpDj2GQHQJ92SE9jf7vdWbHUWxJcVvZlZ1vT+V5bCVO
//nA9Cvyhx/PC4+fu4ieNovcqW18tN+iVKPifl39l6VWwL2a4Qx3cPqz+35aHfLqLz6N/H3RmL8tx8eVP+
//92kRHVSFVq2OaFerh9hW5baatatKq1ZHtKtp+f/d7/X9ormCbl1/dnpdWOrV43fr0vK49fN5ir7+uIy+
///+TVMb06ravXR9lXpfFYfYT9K6WPsK9K47H6CMI4gjCOINojVO/x9cXV/zf54Fnurrk8M9mebWumrmbm
//auaupnA1C1dTupqqbu7vOsN1Gpupq5m5mrmrKVzNwtWUrqbavbVXnY+vdpT57OrMXzf1mX0+dPWt9/Qh
//hmAIhmDvBA/MoeH1Suyt1N7K7K0ceg/pNd+kLwMZeIEXeGc29+2S3Vy0sLcKe4tZr5VeBb3QC73B0Dv8
///NObqhJwHeAevwnhFm7hNpiZrnyHtQBmuOMuLgAxEAMxSw5zjtsGk7fdbG79/A1hW6tej3k8goNf+IVf
//orZgoraA2e0dtB3HGHZhF3YJ2gJahpgEvAp4gRd4idkmH7MFxe2r1nbBFmzBlpCN2e0QywowDMMwzGLD
//ye5o67rb3KjC3irsLeUvXhPEa9ALvcRr89rJ9n7kvjZaE8x2IRdyidam+w3fENBVoAu6oEusNu/da2NS
//62MtF2iBFmiJ1JjVjrdjDYIhGIKJ07zHac39kthbqb2Vub5p4Nla6TVEy40fTSI0uIVbIjTfEdqJMXss
//OOuNL8zCLMwSm/VeYDhZaBXQAi3QEpUNGpXNnteXrM6CK7iCK/EYs9dRQzHYhV3YJRKb7g4zOaLTyvvP
//NxKZwTEcE5lNftdZkAy/8eccmRXDMAwTqU3qO7uBQ6yAGIiBmMhtprvTAuHX4++MgS/4gi+RHLPfMPar
//9Wf5GSa+a2U=
