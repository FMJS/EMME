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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[5] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[6] = "id6_R_t2: 131072;id7_R_t2: 0";
outputs[7] = "id6_R_t2: 131073;id7_R_t2: 0";
outputs[8] = "id6_R_t2: 131328;id7_R_t2: 0";
outputs[9] = "id6_R_t2: 131329;id7_R_t2: 0";
outputs[10] = "id6_R_t2: 131584;id7_R_t2: 0";
outputs[11] = "id6_R_t2: 131585;id7_R_t2: 0";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 2";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 2";
outputs[16] = "id6_R_t2: 512;id7_R_t2: 2";
outputs[17] = "id6_R_t2: 513;id7_R_t2: 2";
outputs[18] = "id6_R_t2: 131072;id7_R_t2: 2";
outputs[19] = "id6_R_t2: 131073;id7_R_t2: 2";
outputs[20] = "id6_R_t2: 131328;id7_R_t2: 2";
outputs[21] = "id6_R_t2: 131329;id7_R_t2: 2";
outputs[22] = "id6_R_t2: 131584;id7_R_t2: 2";
outputs[23] = "id6_R_t2: 131585;id7_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tPwkAUhuG9v6JLTUxK50K9xIXGEDdqgguXxAQXJN4WuDL+d4EWbOEUi3SmneTdkTNnoLTw5CST
//L47fP6cfn9M4jibj/mg4mqqzqHc+GafL13H8+j5+fpk13FxFF9HX4WSsRo+jaXI826EXr46Oo1LViFVb
//qGqxV4u9Rqxm1zqvZleaVZNZx+vT5G1eV4XuYl1X1E1F3VbU+xWfm1/Pd3R5dx3d3nPP6t+ztW/fF6vF
//Xi32arHXiL1G7LVir13vzZ7x8GqweMilO7z8drOdvfnuqsVk26LatqjzxXTbzlTemV/4IP9xiu8v7852
//PjzmO3f5QxzEEjYJ2IAN2DSFzf6e/C6uHlDPPTXCp+4M0HZolO1DDdRAjZe5ZkdqVg8i8UmNdkZNCjVQ
//AzVNUbPv4NI2NEr8CbnixyYKfuAHfro46ZhWADLOqNFQAzVQ071Jx3Ro0nHFT6KTXsqwg0AI1IHjqk2e
//VjdW+TTIutSGeQdt0MbPedVO80471sjzjkOBtDpBIARCIC/zTo2TqrYF0v4FOkUgBEKgpgTa7wCrmxOQ
//d5XsiUElVEKlluYi0zWXjH+BLAIhEAK1MheZMOYivyoVk1wKkAAJkEJLcm0uFjj7f45rrZ6/59/prhop
//LqABGqAJLMXVBDO1M1x/41MrwwU0QAM0gWW4moVGO4MmBRqgAZpQE1zu5hn3+JTzW+ADPuATWH6rWX6M
//M2g00AAN0ISa3vIx5bjCZyO7hT/4gz+BZbeaFci6tIZZB2uwJtjklo9Zx6E/5dwW/uAP/gSV23J3cOXJ
//n1P8wR/8CTO15fs8y4tJ5cwWJmESJgWV2XJ3zOXJH4s/+IM/YSa2fJ9+NWnSD+XgcZg=
