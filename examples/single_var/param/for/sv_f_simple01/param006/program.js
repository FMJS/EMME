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
      for(i = 0; i <= 1; i++){
         var x = new Float32Array(data.x_sab); x[i] = i+0.5;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t2: 0.0000";
outputs[1] = "id3_R_t2: 0.1250";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlb0KwjAQgHefIqNCMbnUpiA4WKS4qKCDYxDqULDq0E7iuxujlajpUSv+0k7tfXfNNfm4UrrJ0m2W
//UkriyJVTmfIuYW2mLkqTTbRcKTIMSI/smnHE5VymIJlDLvfQcogioJ6SRbw2CCsklprT0q096Y8HZDR5
//13o6bq5iicNdf9Mg1A028/gxI3+7qtWdFEHAIMegi8EOBj0MCgz6+SeH5yOxZJ0yZvNzhu1YG7T27Gc8
//e5lKt9DYULeEZ3qzLNWmf7VpfzPRRJEvYHXUgB4G/cqmQTnTgHu1aY+ZZnTBsCkBGOT4fHmJTKKiadfb
//XtW0eqZ94UwTH9DQf+LvWcrAA7eWfmY=
