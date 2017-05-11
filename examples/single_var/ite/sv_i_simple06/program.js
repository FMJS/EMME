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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = Atomics.load(x, 0); report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = Atomics.load(x, 0); report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = Atomics.load(x, 1); report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtls1rwyAYxu/7Kzy2ULAx1cBGDy1b2GEfkG70GMayQ2BtdkhPY//78h11r4muttA2N3mij/roL68Y
//J7v0a5dijOJoFgZhSq7R9CaOaNV2srZX6xhvkujjM+t8v0Rz9D2KIxKuw9SZZKPdojWeoFHtlKulj6x6
//nEpB1cncNm/xNtcJ58zrrkKfKXyoQufnbfdDQbXq+4MWT7fo8fmyU5D2Q8C98+ujoOrJaplusPSLeAW3
//esXZyGk+WjBtFlB/8qBxjb9fnR7oDhvDnqXfal356ZxCZ9qlXzHiPdlGc3/xsLobX2ETWMkAq9DXHRDW
//yIZ2JWaC+wEQblKyBrCw1l58iV5K/4U3bzNLlfbQl66dlYEAMIUH2xu94+3MpJqR3hq3Z2KFzsD5mC30
//gI8M/miMn6gzKxWU6tyxFsOX4NWUQue8KZR+agObVnOUioOQrmU2uZppjUxiVBpVJ6a4XVpUOtLD9lSo
//bNfS/3i4NIJNsnHBvu7xcjQm+M/bteNZa0Yv6f2z9ZFrkrwetb/561u+
