sig mem_events {tear: tear_type, order: order_type, operation: operation_type, block : blocks, addr: set bytes}

abstract sig tear_type {}
one sig tear extends tear_type{}
one sig notear extends tear_type{}

abstract sig order_type {}
one sig init extends order_type{}
one sig unord extends order_type{}
one sig seqcst extends order_type{}

abstract sig operation_type {}
one sig read extends operation_type{}
one sig write extends operation_type{}
one sig modify extends operation_type{}

sig blocks {}
sig bytes {}

sig threads {events: set mem_events, order: mem_events -> mem_events}

// fact ev_threads {all ev: mem_events | some t: threads | ev in t.events}
fact single_ev_thread {all e1,e2: mem_events | all t1,t2: threads | (e1 in t1.events) and (e2 in t2.events) and (t1 != t2) => (e1 != e2)}
fact thread_order {all t: threads | all e1, e2: mem_events | (e1 in t.events) and (e2 in t.events) <=> (((e1 -> e2) in t.order) or ((e2 -> e1) in t.order))}
fact thread_closure {all t: threads | all e1, e2, e3: mem_events | (e1 in t.events) and (e2 in t.events) and (e3 in t.events) and ((e1 -> e2) in t.order) and ((e2 -> e3) in t.order) => ((e1 -> e3) in t.order)}
fact not_empty_threads {all t: threads | t.events != none}

// For each element in the sets tear_type, order_type, operation_type, blocks, and bytes there should be at least one event in the mem_events matching it
// fact tear_match {all te: tear_type | some ev:mem_events | ev.tear = te}
// fact order_match {all ord: order_type | some ev:mem_events | ev.order = ord}
// fact operation_match {all op: operation_type | some ev:mem_events | ev.operation = op}
// fact block_match {all bl: blocks | some ev:mem_events | ev.block = bl}
// fact addresses_match {all add: bytes | some ev:mem_events | add in ev.addr}

// The events should have all fields assigned
fact nempty_tear {all ev: mem_events | ev.tear != none}
fact nempty_order {all ev: mem_events | ev.order != none}
fact nempty_operation {all ev: mem_events | ev.operation != none}
fact nempty_block {all ev: mem_events | ev.block != none}
fact nempty_address {all ev: mem_events | ev.addr != none}

pred Read(e: mem_events) { e.operation in read }
pred Write(e: mem_events) { e.operation in write }
pred Modify(e: mem_events) { e.operation in modify }
pred RoM(e: mem_events) { Read [e] or Modify [e] }
pred WoM(e: mem_events) { Write [e] or Modify [e]}

pred SeqCst(e: mem_events) {e.order in seqcst}
pred Init(e: mem_events) {e.order in init}
pred Unord(e: mem_events) {e.order in unord}

pred BlockEQ(e1:mem_events, e2:mem_events) {e1.block= e2.block}
pred AddrIN(e1:mem_events, e2:mem_events) {(e1.addr & e2.addr) != none}
pred AddrEQ(e1:mem_events, e2:mem_events) {e1.addr = e2.addr}
pred RangeIN(e1:mem_events, e2:mem_events) {BlockEQ [e1,e2] and AddrIN [e1,e2]}
pred RangeEQ(e1:mem_events, e2:mem_events) {BlockEQ [e1,e2] and AddrEQ [e1,e2]}
pred NoTear(e: mem_events) { e.tear in notear }
pred Block(e:mem_events, b:blocks) {e.block = b}


-- Preconditions
//fact init_events {some e: mem_events | all b: blocks | is_write [e] and (e.block = b) and (e.addr = bytes) and Init [e]}
//fact init_write {all e: mem_events | Init [e] => is_write [e]}
//fact init_ao {all e1, e2: mem_events | (e1 != e2) and AO [e1,e2] => (not(Init [e2]))}

-- Agent Order relation
one sig agent_order {rel:  mem_events -> mem_events}
pred AO(e1: mem_events, e2: mem_events) {(e1 -> e2) in agent_order.rel}
fact ao_def {all t: threads | all e1,e2: mem_events | ((e1 in t.events) and (e2 in t.events) and ((e1 -> e2) in t.order)) => AO [e1, e2]}

-- Reads From relation
one sig reads_from {rel:  mem_events -> mem_events}
one sig reads_bytes_from {rel:  mem_events -> bytes -> mem_events}

pred RF(e1: mem_events, e2: mem_events) {(e1 -> e2)  in reads_from.rel}
// pred RBF(e1: mem_events, b: bytes, e2: mem_events) {(b in e2.addr) and (b in e1.addr) and ((e1 -> e2) in reads_from.rel)}
pred RBF(e1: mem_events, b: bytes, e2: mem_events) {(e1 -> b -> e2)  in reads_bytes_from.rel}

fact rbf_def {all er : mem_events | RoM [er] => (all b : bytes | (b in er.addr) => (one ew : mem_events | (b in ew.addr) and BlockEQ [er,ew] and WoM [ew] and RBF [er,b,ew])) }
fact rbf_rf_def {all e1,e2 : mem_events | (RF [e1,e2] <=> (some b:bytes | RBF [e1,b,e2]))}
fact rbf_corr {all er,ew: mem_events | all b: bytes | RBF [er,b,ew] => not (some ev: mem_events | RBF [er,b,ev] and (ew != ev))}

-- Synchronizes with relation
one sig synchronizes_with {rel:  mem_events -> mem_events}
pred SW(e1: mem_events, e2: mem_events) {(e1 -> e2)  in synchronizes_with.rel}

pred SW4(er:mem_events, ew:mem_events) {SeqCst [er] and RF[er,ew]}
pred SW4c(er:mem_events, ew:mem_events) {SeqCst [ew] and RangeEQ [er,ew]}
pred SW4di(er:mem_events) {all ev: mem_events | RF [er,ev] => Init [ev]}
pred SW4d(er,ew: mem_events) {Init [ew] and SW4di [er]}

fact sw_def {all er,ew : mem_events | SW [ew,er] <=> ((SW4 [er,ew] and (SW4c [er,ew] or SW4d [er,ew])))}

-- Happens Before relation
one sig happens_before {rel:  mem_events -> mem_events}
pred HB(e1: mem_events, e2: mem_events) {(e1 -> e2)  in happens_before.rel}

pred HB4a(ee, ed: mem_events) {AO [ee, ed]}
pred HB4b(ee, ed: mem_events) {SW [ee, ed]}
pred HB4c(ee, ed: mem_events) {Init [ee] and RangeIN [ee,ed]}
pred HB4d(ee, ed: mem_events) {some ef : mem_events | HB [ee, ef] and HB [ef, ed]}

fact hb_def {all ee,ed : mem_events | HB [ee,ed] <=> ((ee != ed) and (HB4a [ee,ed] or HB4b [ee,ed] or HB4c [ee,ed] or HB4d [ee,ed]))}
fact hb_closure {all e1,e2,e3 : mem_events | HB [e1,e2] and HB [e2,e3] => HB [e1,e3]}

-- Coherent Reads
fact cr_def {all er,ew : mem_events | (RoM [er] and WoM[ew]) => (all b: bytes | (RBF [er,b,ew] => ((not HB [er,ew]) and (not (some ev: mem_events | WoM [ev] and (HB [ew,ev] and HB [ev,er] and BlockEQ [ev,ew] and (b in ev.addr)))))))}

-- Tear Free Reads
pred TFR2aiiA1(er,ew: mem_events) {not (some ev: mem_events | RangeEQ [ev,ew] and NoTear [ev] and (not (ev = ew)) and RF [er,ev])}
pred TFR2aiiA(er,ew: mem_events) {RangeEQ [er,ew] => TFR2aiiA1 [er,ew]}
pred TFR2aii(er: mem_events) {all ew : mem_events | (RF [er, ew] and NoTear [ew]) => TFR2aiiA [er,ew]}
pred TFR2a(er: mem_events) {NoTear [er] => TFR2aii [er]}

fact tfr_def {all er: mem_events | RoM [er] => TFR2a [er]}

-- Memory Order
one sig memory_order {rel:  mem_events -> mem_events}
pred MO(e1: mem_events, e2: mem_events) {(e1 -> e2)  in memory_order.rel}

pred MO3bii(ee,ed: mem_events) {not (some ew: mem_events | WoM [ew] and RangeEQ [ew,ed] and MO [ee,ew] and MO [ew,ed])}
pred MO3b(ee,ed: mem_events) {SW [ee,ed] => MO3bii [ee,ed]}
pred MO3a(ee,ed: mem_events) {HB [ee,ed] => MO [ee,ed]}

fact mo_def {all ee,ed: mem_events | MO3a [ee,ed] and MO3b [ee,ed]}
fact mo_closure {all e1,e2,e3 : mem_events | MO [e1,e2] and MO [e2,e3] => MO [e1,e3]}


-- Checks

one sig thread_main extends threads{}
one sig thread_1 extends threads{}
one sig thread_2 extends threads{}

fact thread_main_in_threads {thread_main in threads }
fact thread_1_in_threads {thread_1 in threads }
fact thread_2_in_threads {thread_2 in threads }

one sig id1_W_main extends mem_events{}
one sig id2_W_t1 extends mem_events{}
one sig id3_R_t2 extends mem_events{}
// fact no_additional_events {all e: mem_events | (e = id1_W_main) or (e = id2_W_t1) or (e = id3_R_t2)}

one sig block_x extends blocks{}
// fact no_additional_blocks {all b: blocks | (b = block_x)}

one sig byte_0 extends bytes{}
one sig byte_1 extends bytes{}
// fact no_additional_bytes {all b: bytes | (b = byte_0) or (b = byte_1)}

fact id1_W_main_def {NoTear [id1_W_main] and Write [id1_W_main] and Init [id1_W_main] and Block [id1_W_main, block_x] and (byte_0 in id1_W_main.addr) and (byte_1 in id1_W_main.addr)}
fact id1_W_main_in_mem_events {id1_W_main in mem_events}

fact id2_W_t1_def {NoTear [id2_W_t1] and Write [id2_W_t1] and Unord [id2_W_t1] and Block [id2_W_t1, block_x] and (byte_0 in id2_W_t1.addr) and (byte_1 in id2_W_t1.addr)}
fact id2_W_t1_in_mem_events {id2_W_t1 in mem_events}

fact id3_R_t2_def {NoTear [id3_R_t2] and Read [id3_R_t2] and Unord [id3_R_t2] and Block [id3_R_t2, block_x] and (byte_0 in id3_R_t2.addr) and (byte_1 in id3_R_t2.addr)}
fact id3_R_t2_in_mem_events {id3_R_t2 in mem_events}

fact id1_W_main_in_thread_main {id1_W_main in (thread_main.events)}
fact id2_W_t1_in_thread_1 {id2_W_t1 in (thread_1.events)}
fact id3_W_t2_in_thread_2 {id3_R_t2 in (thread_2.events)}

fact blocking_1 {not (RF [id3_R_t2, id1_W_main])}
//fact blocking_2 {not (RF [id3_R_t2, id2_W_t1])}

//fact ao_def { agent_order = none}

run {} for exactly 3 mem_events, exactly 3 threads, exactly 1 blocks, exactly 2 bytes, exactly 3 order_type, exactly 2 tear_type, exactly 3 operation_type

