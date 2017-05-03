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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 3);
      var x = new Int16Array(data.x_sab); id6_R_t1 = Atomics.load(x, 0); report.push("id6_R_t1: "+id6_R_t1);
      var x = new Int16Array(data.x_sab); id7_R_t1 = Atomics.load(x, 1); report.push("id7_R_t1: "+id7_R_t1);
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
      if (reports >= 1) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t1: 256;id7_R_t1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtkr8KwjAYxF8lo0Ihbf40oDhYpLioUAfHItQhYK1DO0nf3bSNoa2XFxC35Hdf7g6+UFo19bOpKSW6
//iPMsr6MVYTJe60LZm1IhpWVV3O5maJ+QDXktdMHyi1ED84r3p2VAJlRAKiEdcudUjSiHvhz6cujLoa+A
//DgI6COgg4ayEs8PEnEZmtrzqR8fZqMWYcw8XHi49PPbk2j4t2R535HD67/jXd5wlab/kSWPXLOxeTyRX
//LrKScpLrx74kV5F/YlP7tUAozsNRKGVIOF+6hPYN5KdpBA==
