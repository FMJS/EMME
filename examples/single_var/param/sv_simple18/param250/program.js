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
      var x = new Int8Array(data.x_sab); x[1] = 3;
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
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 770;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 259";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 259";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 259";
outputs[15] = "id6_R_t2: 770;id7_R_t2: 259";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T6GxhYBiybJ6oUNDCV3aQjpkNAV3MDRNB2cqeffa8QXHOW4dSb4M/xaOjnyRw4f9
//I863u+R7l3DO4igIV2Eibtn8Lo50+ZvzzTb6+Ewbnhbsnv1cxpEI12HizdIZ8vDrasaOqj5ZVbWqJHsl
//2euT1fxas2p+pXnVSzs27/FXVhe17npdttT9lrpqqQct5y2uZ88eXh7Z8yvWrPuaNe4+IKv1Xkn2SrLX
//J3t9sleRvarZmz/j1WJ5eMhHK1zeXTpzns1uG/SKQU0Nir8GZXn6ZfEXI49Pz85nvq2zmfsLTiEggAAQ
//AAKuEPBOEKiWed4/AcRZjWHQwTVoAA2gob/3g2o5vSFpkPY0aHw6gAbQYEfDyYvBUDAI8oHbs1BHQQIF
//oAAUxskT5MlgteDCIk1o1ItjnpkxAAbAABhGyRhcsNA5YTDG4jh3ABfgAlyMkju45UL2xYXGZwe4ABcj
//ZxFmWBglEcZU1KEQKgAVoAJUTGXHQ7Ww0l1CoYwSCtAAGkDDZPZBnA+DaUahDDMKgAEwAMZkdkfYgCH7
//AkPj4wNgAIwJ7pnowoWLnEIZ5hQ3oAJUgIoBc4pacukypfBJLkwzCrAAFsDCcBmFUxT+SyhsqWjmE8AC
//WACL4fKJnrCQ/WCh8cEBLIDFONmEJRXnJBPdofgF57NihA==
