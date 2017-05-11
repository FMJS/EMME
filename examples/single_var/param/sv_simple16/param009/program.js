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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 131072;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 131074;id7_R_t2: 0";
outputs[6] = "id6_R_t2: 131584;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 131586;id7_R_t2: 0";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 2";
outputs[12] = "id6_R_t2: 131072;id7_R_t2: 2";
outputs[13] = "id6_R_t2: 131074;id7_R_t2: 2";
outputs[14] = "id6_R_t2: 131584;id7_R_t2: 2";
outputs[15] = "id6_R_t2: 131586;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt27FPwkAUx/Hdv6KjJiSlvWsxGgeJIS5qggMjMcGhiYgDTMb/XaAFC7xCkd61F76befcOSouf/JLj
//+f5kNv2aTX3fS0bxsD+chjde+zYZdVZ/+/54Mnr/mDc8dr077/syGYXDwXAatOY71PKvq5a3UdViNcpV
//ldirxF4tVtNrXVTTK02rwbxj/JZ8LuphrjtfVwV1XVCPCupxwftm1/Pj3T8/eE8v3LPy92zr08diNd+r
//xF4l9mqxV4u9kdgbbfemz7jf7S0f8sYdXn26+c72YnfRYrBvMdy3qLLFzr6dHXlnduG97Mspvr68O935
//Osh2HvMPceFL2IRgAzZgUxU2p3vyt7h+QG3z1AjvejRA+6GJAqiBGqixk2uOpGb9IAKb1Chj1GiogRqo
//qYqaU4NL3dCE4ldIkXTgB37OK+noWgDSJB2ogZpzSjq6QUnHFD+BCtodwg4CIVADjqt2eVrf2NCmQZFJ
//bcg7aIM2ds6rjso79Vgj5x2DAkXXCIRACGQn75Q4qapbIGVfoBiBEAiBqhLotAOsZiYgRS5CJVQ6n1yk
//m+aSJhchEAKdSy7SbuQiuyrlJ7lCQAIkQHJtkmt3McfZ/+e4turZax6e7ioxxQU0QAM0jk1xVcFM6Rmu
//w/iU+mUz0AAN0Dg2w1UtNMoYNBpogAZoXJ3gMpdnbOBDygEf8HF4fqtafjQpB2iAhumtOlKOKXx2Zrfw
//B3/wx7HZrWoFikxaQ9bBGqxxdnLLRtYx6M/m75PxB3/wx6m5LXMHV5b8ifEHf/DHzakt2+dZZCJMwiRm
//tmyqpMlE+IM/TGw1KBOZMukXqRRxoA==
