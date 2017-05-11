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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQRG54wGWrpoKKGbtpAuspSCWQhN04VZlbx7NV4wemyNGY2m/07OnPEyyof8
//jJSbbfi1DaUUge96Cy9Ut8K6C/xpdizleuOvPqKGp5m4F9/Xga+8pRfak2gG7Y9uJuKgqtmqU6gS20ts
//r2aryb3G1eROk6oddazfg8+4rgrdxTrV1HVN3ampuzXXTe9nJx5eHsXzK9as+ZqVnt5lq8VeYnuJ7dVs
//r2Z7HbbXKfcm73gxm+9f8sEKZ08XzbTi2XWDdjo45QbVb4OUXX6efmLs+fnZycy3ZTxzdyWBABAAAp0i
//YFcQyJfZ6p4A5qqAATAAhiH+HeTLafcJAwEGwAAYzgxD5aegLxYU+8LNoqCAAlAACufJEqgymC+4OiFJ
//KNXTcwIGwAAYxpAvmGChcboALIAFsBhv5mAWCwIWwAJYXGYO0Y6KVimEESgcG1SAClAxmJ0O+cKSuXTC
//AQ2gATSMe//D8TC0zSfABbgAFyPfFXEKFwQuwAW4+D97JZpgYSKjaEuFBhWgAlT0mFEUUkuTCYVmuQAL
//YAEsDD+fMIrCX+kEqAAVoGKs2URHVBCoABWg4oJyiROhOCaVaM7ED+RBXsA=
