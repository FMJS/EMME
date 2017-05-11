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
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
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
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 131074;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131586;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[9] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[10] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[11] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[12] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 131074;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 131586;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tPwkAUhuG9v6JLTUhKO51iNC4khrhRE1y4JCZ1QSLiAlbG/25LCwww3GzPtIF315x2BnrhyRem
//x/fH08n3dOL73jCJB/3BRN147dth0plv+/5onHx8pgc8dr077+dymISDt8EkaKUj1GzrquWl1SjbDrOq
//nm3l1XzOrJrPmFeD9IjR+/Arq4fGHGZdbalHxuxmXW+px1s+t/g+v97984P39HKK5zarL8/InH1Z1dZq
//bJ3BnFdZ51XWeZV1XmWdd3mtY2vVPFZbj9Xrx+b3uN/tzW7yyp2bX7V0ZDsbvW1nsGtnuGunKnZ2do3s
//2EcWX7xXPJzW+e2j85Gvb8XIY34QF74NhRAUQOH8UCj/u1/uXNz4tjwJlk89GordIOgAEiCBnFCKhMUN
//DlySoMRIiCABEs6PhLJBoG4QzIfNBRMkB5ggOZQyZHFJnEJh3giSAyRAQmOSQz0g2JODFBOBCtodwgNS
//EB6O+Jtyk5HFyYcurdCSKpAfUIH1iRL5oR4T7PlBUAp9jRRIQX44emWibimUeylipECK85Oi3IJFMxOF
//ImegB3o0L2ds/G1Ztx+R9dEkZyAFUtSYMxrnxP6VD3k9zE6NEDiAg4gh1amxudNg5/99Gmv1Ys793RsH
//dGkAAiCwCiLUpVEFBwf3aOxH4qA3LQEBEEgIQj0a1YKgxECIAAEQeM9SukNDLh+4QILUABKkBgf9GdUy
//see1a1IDIABCk7szXKQGKSQ2ejNwAicIDkK9GdVKoSVNIDtgAmsS4p0ZLrKDoBOr70viBE6QHUT6MuQW
//Khw5EeMETvC2pGxXhuv1CzIGdmDHqfRkyC1rkDFwAidOoyPD9WpHlXb8ASkiErQ=
