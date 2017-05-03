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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 513;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131073;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 131328;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 131329;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 131585;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 1;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 256;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 257;id7_R_t3: 2";
outputs[16] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[17] = "id6_R_t3: 513;id7_R_t3: 2";
outputs[18] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[19] = "id6_R_t3: 131073;id7_R_t3: 2";
outputs[20] = "id6_R_t3: 131328;id7_R_t3: 2";
outputs[21] = "id6_R_t3: 131329;id7_R_t3: 2";
outputs[22] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[23] = "id6_R_t3: 131585;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tPwkAUhuG9v6JLTUxKZ6YUNC40xrhRE12wbExwQeJtASvjfxdshRaGUmDmDInvjpy5tKXw5Esm
//J44/JuPPyTiOo9Gwmz/mY30Wdc5Hw+zvcxy/fQxfXqcTbq+ii+jreDRU+SAfJ6fTFfr308lpVKuaSlVb
//q8WVZtXiOkU1mc54ex69z+qqMrta12vqZk09ndXVar275rrl/XxHl/fX0d3D/3nipSeq7rKodq1zqzto
//6w7auoO27mCsOxjrDsa6Q7Fuee6iWnvHj1c3vy+59o7+vp/pys5s9brBpGlQNQ3qcjBrWpnZV5Y3flP+
//OK3721cXK58G5cpt/hBHsY2KBCqgAipcabAYnL/ijn8oLFfdmo9mJlTaBQqgAIoWmWJLKOavMpGEQnuD
//IgMKoAAKN6EhNBPK+iP0hUeaKPAAD/BwnzJMED6MNyg0UAAFULhOGeaAUoYvPBKddDKCBn7gx95HJKu4
//zB9ISQpS/RqdW0HWwAqs2I2DhqwRRgp71vDoh1Y9/MAP/GiRNVqcjoT2Q8v70ccP/MAPF4cmh5k+xE1J
//ewZTMAVTdsok5tBUMfJ+pPiBH/jh4ojlMDOJrCnVjhUFJ3BCHJHtWFkdrGC0e7/KUr3cc3MXS4tuFZiA
//CU5iRLtVXCDRuldlMx2telVgAiZIE6K9Km6Z0N6YyGACJmAiTKeKvyzhn456nwp0QAcJQ7RPxS0exhsT
//GiZgAibCdKlIJAxfdKz0qKAHehAyRHtU3Pqx4eR0PynIGUiBFIE6VCRyhkc96v0p6IEe5AzB/hR/hyVC
//evTRAz3QI0R3ivQZiogo9d4UREEU8ohgb4q/oxUhPVL0QA/0CNGZIn3i4lKUH9EGqkw=
