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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 258;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 258;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 258;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 259";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 259";
outputs[15] = "id6_R_t2: 258;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stqg0AUBuB9n2KWLQSMcxxjW7poKKGbtpAuspSAXQhN04VZlbx7NRqZmGNrxvGy+Hdy5oyXUT7k
//Zxxnu0u+d4njiDjyw2WYyDsxvY+j2fHYcTbb6OMzbXieiwfxcx1HMlyFiTtJZ9Dh6GYiTqoeW1Valdhe
//Yns9tprfa1bN7zSvumnHZh1/ZXWpdet1qql7NXVVU/drrlvcz148vj6JlzesWfM1qzy9z1b1XmJ7ie31
//2F6P7VVsr6r25u94OV8cXvLJCh+fLp05zWbXDbrF4IwblH8N0vHyi+ITY8/Pz85nvq+ymfsrh0NAAgEg
//AARsIeCeIVAu87R7ApirmsOgfNAAGkBDd/8H5XK6fdJAFmgIQANoAA2taDj7MegLBsm+8PYs6HkCAQWg
//ABSGyRPobLBccNkiTajUi3NemDEABsAAGAbJGGyw0DhhMMfiJHcAF+ACXAySO9jlgjrjIgAX4AJcDJtF
//mGFhlEQYU6HnE+lfBqgAFaBiLDseyoUlewmFMkooQANoAA2j2QdxOQymGYUyzCgABsAAGKPZHdEGDOoM
//jABgAAyAMb49E024sJFTKMOc4hZUgApQ0WNOoSWXNlMKj+XCNKMAC2ABLPSXUVhF4b+EojUVlXwCWAAL
//YNFfPtERFtQRFgGwABbAYpBsoiUVlyQTzaH4BTZaYmg=
