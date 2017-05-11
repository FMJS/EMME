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
      var x = new Float32Array(data.x_sab); x[0] = 1.5000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
      var x = new Float32Array(data.x_sab); x[2] = 0.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 0.1250;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 1.5000";
outputs[3] = "id6_R_t3: 0.1250;id7_R_t3: 1.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt27tOwzAUBuCdp8gIUkWaOLYlEAMVqlgACQbGCKkMlbgN7YR4d3KjMe2xQ2mb+PIzRcfxIU7aj+MY
//x/H7cvGxXMRxNJ+J/D5fsLNofDoufs7nM/krEMev77Pnl+LU60l0EX0ez2dp/pgvklHRl1VHJ6OoiGbl
//cVpGeXVUR+vsZbROW0eT4ozXp/lbGU+VHGqcaeKZkl2Nc01caH5vcz1f0eXtVXRz5+PY1q49JUdEj1OQ
//GdS8nMzLybyczMvJvO1dVfO2UTWvJM+V6+fWz/h+Mq0e8q9sP3et6Dkue+saE1NjampkpsbM1MhNjcLU
//KJtGaRqnNI1TmsYp6XE2t3nafJXIK6N71z0fHpue23x9j2JgBsyAWT+YHdgr4nYxmykTHY/sL8ABMkAG
//yKyqyjatWg0v0zdxfZN0AzF2MMSSlAMxIBYUYqt+Y311k+ib0u6aaG8+CWfo2ubBofoCXIDLxupL9Gib
//dG8CCdgAG2ALYFq5+ghk+iaub3KENvWDDsSAGBBzZVq5o0/CGbroBwe4ABfg8nRaGUbtBdgAG2Dzelq5
//1Xv9v6jn4GolaANtoM2TNUzf35N1PzhwBs7AmYuVGu9RPG9WNgfgLjnlAXBXxdsRhYJgOyI1exvlZFSY
//7lkVZWReRuZlZF5G5v0fxEZcseVps3aV+tpV6mtXSUm+9VanVP3b1LnRafMrC9bAGljD5icLUOva9ERT
//B9JAGkhzqlLrYRuUVZyxg3C2tvUJnIGzQDnzdUPUIIj943UpKjIQBsIsr8iG3Rpl7fQSxIE4EBfkpHPv
////xhFXL0iic4A2fgzLVJZ5/bpSyadIIwEAbCgpl0+l2PgTgQB+ICm3T2sIXK2pVOIAfkgJy365++vk/b
//fVcBYANsgM2N6m3YbVWOrYruC75vuHW1yA==
