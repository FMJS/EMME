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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stOg0AUBuC9TzFLTZpMmTPQqHFhYxo3alIXXRITXJBY64KuTN9dKJdQOCiFgUL9d+TMGS4D+UL+
//jJSbbfC1DaQUvue4SzdQN2J663uz9FjK9cZ7/wgbHufiTnxf+p5yV25gTcIZtD+6moiDqmardq5KbC+x
//vZqtxvcaVeM7jatW2LF+8z+jusp15+tUUdcVdbui7lRcN7mfnbh/fhBPL1iz+mtWeHqHreZ7ie0ltlez
//vZrttdleu9gbv+PlfLF/yQcrnD5dOHMaza4atJLBGTeofhuk9PKL5BNjz8/Pjme+rqKZuwsJBIAAEOgU
//AauEQLbM0+4JYK4KGAADYBji30G2nFafMBBgAAyA4cQwlH4K+mJBsS/cLAoEFIACUDhNlkClwWzBVYsk
//oVBPzgkYAANgGEO+YIKF2ukCsAAWwGK8mYNZLAhYAAtgcZ45RDMqGqUQRqBQtgMqQAWoGMpOh2xhyVw6
//YYMG0AAaxr3/4XgYmuYT4AJcgIuR74powwWBC3ABLv7PXok6WJjIKJpScQ0qQAWo6DGjyKWWJhMKzXIB
//FsACWBh+PmEUhb/SCVABKkDFWLOJjqggUAEqQMUZ5RItoTgmlajPxA+heV7w
