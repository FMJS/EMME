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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 769;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[7] = "id6_R_t2: 769;id7_R_t2: 2";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 769;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 258";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 258";
outputs[15] = "id6_R_t2: 769;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiybLjlg4NJXRpC+mQ0RTcwdA0HZyp5N1rxxd8OW4dWb4M/2aOjnyRzYf5
//EeeHY/R9jDhnYeD4Wz8St2x5FwZufsz5/hB8fMYNT2t2z36uw0D4Oz+yFvEMeT66WbBK1SarqlSVZK8k
//e22ymt5rUk3vNK1accf+PfxK6qLUXa7LlrrdUlctdaflutn9nNjDyyN7fsWadV+z2tM7ZLXcK8leSfba
//ZK9N9iqyV9V703e8XW/OL7mywvnTxTOXyey2QSsbdKlB8degzC+/yT4x8vz07HTm2y6ZebriFAIWEAAC
//QMAUAlYDgWKZl8MTQFxVGwbXWYEG0AAahvs/KJbTGpMGaYAGDzSABtDQi4bGj8FYMAjyhfdnoZwnCKAA
//FIDCNHmCbAwWCy56pAm1enbOCzMGwAAYAMMkGYMJFjonDNpYVHMHcAEuwMUkuYNZLuRgXHjgAlyAi2mz
//CD0stJIIbSoq+YRyQAWoABVz2fFQLKw0l1AovYQCNIAG0DCXfRCXw6CbUSjdjAJgAAyAMZfdEX3AkIOB
//4QEMgAEw5rdnogsXJnIKpZlTrEAFqAAVI+YUpeTSZEphk1zoZhRgASyAhfEyCqMo/JdQ9KWink8AC2AB
//LMbLJwbCQg6EhQcsgAWwmCSb6EnFJclEdyh+ARr4Ypg=
