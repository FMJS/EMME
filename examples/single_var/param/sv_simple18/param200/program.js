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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ0cnIRxYVFihsV6qLLIMRFwFoX6Ur67ibNhTQ50WQyuQj/rpw506ST8nH4
//iZT7Q/R1iKQUYeD6Gz+ybsTyNgy8/LOUu33w/hE3PK7Enfi+DAPL3/qRWsQ76PTpaiHOqjZbdUpVYnuJ
//7bXZanqvSTW907Sq4o7dW/iZ1K1Sd7lODXW7oe401N2G62b3cxT3zw/i6QVn1v7MKr/eZavlXmJ7ie21
//2V6b7XXYXqfamz7jzWp9eshnJ5z/unjnMtndtKiyRY9btH5bpPzy6+wvxn4/vzvd+bpNdh4vJIeAAgJA
//AAiYQkDVECiOeTk8AcxVtWHAdAAYAMOA00FxnGpMGKg3DJgYAANg6AdDbSgYiwWLfeBkdFogoAAUgMI0
//WQLVFosDt3okCZV69p0dpwXAABgAwyT5ggkWWqcL2lhgigAWwGLyzMEsFjQQFpgsgAWwmDiH0KNCK4Uw
//MlV47jWoABWgYi5vOhQHS+bSCUdrhgANoAE0zOb9h+4w6OYTDiYJcAEu/vdbEX24oIG4wHQBLsDFDN+V
//aIOFiYxCc7LwFKgAFaBixIyilFqaTChslgvNCQIsgAWwMGI+YRSFv9KJvlRgggAVoGKqbGIgKmgQKjBV
//gApQMU0u0ROKLqlEeyZ+AN2XXxQ=
