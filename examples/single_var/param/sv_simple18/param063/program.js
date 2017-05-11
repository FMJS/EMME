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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 771;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 771;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGWvE0rigeHDC8qzMOORaiHgnMeupPsu9uuXem2t9olrcvguZU3b/onLT/K
//Q6RcrrKvVSalSJMwnsWZvhHj2zSJtsdSLpbJ+0fe8DgRd+L7Mk10PI8zNcpn0OboaiR2qgFbNY0qsb3E
//9gZstbzXolreaVlVecfiLf0s6rrR3axTSz1oqZuWethy3ep+1uL++UE8vWDNuq/Z3tOHbLXZS2wvsb0B
//2xuwvYbtNfu95TueTaabl7yzwtuny2eOi9ltg6oajLhB/dsgbS8/rT4x9vz87HLm67yYub6QHAIEBIAA
//EOgLAXWAQL3M4+EJYK5qDUMUXoMG0AAahvs/qJdT/ScN5E5DpEADaAANTjQc/Bj8FwyafeHuLCBPAApA
//wYM8gQ4G6wXXDmnCXr06JzIGwAAYziFj6IOFzgmDNRbIHcAFuPAgd+iXCxqKC2QR4AJcnDqLsMPCKomw
//pqKZTxilQQWoABW+7HioF5b6SyiMVUIBGkADaPBmH8TxMNhmFMYyowAYAANgeLM7wgUMGgqMnZQCYAAM
//gOHJnokuXPSRUxjkFKACVJxBTtFILvtMKQKWC2QUYAEs+J9R9IrCXwmFKxXIJ4AFsDhdPjEQFjQMFsgm
//gAWwOFE24UjFMclEdyh+AIR7Ykw=
