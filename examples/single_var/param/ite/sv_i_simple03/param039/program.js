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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 <= id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[10] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[11] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[12] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[13] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 0";
outputs[14] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[15] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[16] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[17] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 1";
outputs[19] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 1";
outputs[20] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[22] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 2";
outputs[23] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[25] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 2";
outputs[26] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt201PwkAQBuC7v6JHTUzK7sCSaDxIlHjwIwENR2KsBxIRD/Vk/O8WKLqUXe3HDp2Y99YsdGqXPpnJ
//mxrHi/f07T2N42iWdKejaapPInU6S3r5cSc77m+O43i+SJ5fsi9fDaKz6ONwlujpZJqq4+xsWh0dHUeH
//m0rL1XWd4mrfWu05V1VWbf44e12ua6uyvU6e9a6nTs+znl/3Mzq/vYhu7v7fna3Wf+6n61ztOVftCuSs
//QM4KVKyw3t3RYLja3q09+96FzvLcrY3b3Iz1Yd/9YV5/mP96juq+wu6a63rjybLe+ni1t0+L1+RseH49
//vjw6iF14NPAAzx7xECseag+PAh7gaQ/PTlMKQ8fe94BwfCObAhzAETSyWecFGtjyb4ce1wAHcCSNa2Xg
//UFtwFOAAjshRrT4b96DWEI1vTNNAAzSCxjQKPqYRz5gGOIAjaUyj4GMa8YxpgAM4csY0CjymNUTTKXQb
//EyiG5n5cfq5qnI+u8dQwjdFw31mVB77Ko91wxwp/hXFez/yJxtFSfu03pmIUvd1bfD3HVIuj70cPZfwo
//+IGfNv3stJ1QeuzfKZwdBTuws0c7usLAZoK8esPjxu45Gm7gps2eQ1w9h9h7DuzATos9h3h6Do8bDTdw
//s0c3xOiG9ujGl68puIEbUflamfcHqqZrJd4hqJGtwQ7sSMrWmshxJwTN3Ci4gRvxuVr996M5zPgyNZiB
//GUmZWpNeQ8y9Bm7gRmaeVr/XcJjRMAMz4rO0+v9PQMzzmZ2jaZiBGVE5GjHkaMSSo8EO7EjK0Sh4jkYs
//ORrcwI2cHI0C52jEkqPBDMxIytEoeI5GLDka3MCNnByNAudoxJKjwQzMyMnRKHCOVtbMFyBbdKg=
