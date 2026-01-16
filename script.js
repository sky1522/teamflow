// ========== 전역 변수 ==========
let currentUser = null;
let currentTeam = null;
let selectedDate = null;
let currentFilter = 'all';
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let attachedFiles = [];
let currentTodoForDetail = null;

// ========== 초기화 ==========
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initEventListeners();
});

// ========== 인증 상태 확인 ==========
function initAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            showApp();
            loadUserTeams();
        } else {
            currentUser = null;
            showAuth();
        }
    });
}

// ========== 이벤트 리스너 설정 ==========
function initEventListeners() {
    // 인증 탭
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + 'Form').classList.add('active');
        });
    });

    // 로그인
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('loginPassword').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('googleLoginBtn').addEventListener('click', handleGoogleLogin);

    // 회원가입
    document.getElementById('signupBtn').addEventListener('click', handleSignup);
    document.getElementById('signupPassword').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleSignup();
    });
    document.getElementById('googleSignupBtn').addEventListener('click', handleGoogleLogin);

    // 사용자 메뉴
    document.getElementById('userMenuBtn').addEventListener('click', toggleUserMenu);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // 팀 관리
    document.getElementById('teamSelector').addEventListener('change', handleTeamChange);
    document.getElementById('createTeamBtn').addEventListener('click', () => openModal('createTeamModal'));
    document.getElementById('createTeamBtn2').addEventListener('click', () => openModal('createTeamModal'));
    document.getElementById('joinTeamBtn').addEventListener('click', () => openModal('joinTeamModal'));
    document.getElementById('inviteMemberBtn').addEventListener('click', () => openModal('inviteMemberModal'));
    document.getElementById('deleteTeamBtn').addEventListener('click', handleDeleteTeam);

    // 팀 생성 모달
    document.getElementById('confirmCreateTeam').addEventListener('click', handleCreateTeam);
    document.getElementById('cancelCreateTeam').addEventListener('click', () => closeModal('createTeamModal'));

    // 팀 참여 모달
    document.getElementById('confirmJoinTeam').addEventListener('click', handleJoinTeam);
    document.getElementById('cancelJoinTeam').addEventListener('click', () => closeModal('joinTeamModal'));

    // 팀원 초대 모달
    document.getElementById('copyTeamCode').addEventListener('click', handleCopyTeamCode);
    document.getElementById('closeInviteModal').addEventListener('click', () => closeModal('inviteMemberModal'));

    // 모달 닫기
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            modal.classList.remove('active');
        });
    });

    // 모달 배경 클릭시 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // 달력
    document.getElementById('prevMonth').addEventListener('click', handlePrevMonth);
    document.getElementById('nextMonth').addEventListener('click', handleNextMonth);

    // 할일 관리
    document.getElementById('addBtn').addEventListener('click', handleAddTodo);
    document.getElementById('todoInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') handleAddTodo();
    });
    document.getElementById('clearCompleted').addEventListener('click', handleClearCompleted);

    // 파일 첨부
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);

    // 필터
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // 채팅
    document.getElementById('sendChatBtn').addEventListener('click', handleSendMessage);
    document.getElementById('chatInput').addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // 할일 상세 모달
    document.getElementById('addCommentBtn').addEventListener('click', handleAddComment);
}

// ========== 인증 함수 ==========
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('이메일과 비밀번호를 입력하세요.');
        return;
    }

    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
}

async function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
        alert('모든 필드를 입력하세요.');
        return;
    }

    if (password.length < 6) {
        alert('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // 사용자 정보 저장
        await database.ref('users/' + userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
    } catch (error) {
        alert('회원가입 실패: ' + error.message);
    }
}

async function handleGoogleLogin() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        
        // 신규 사용자인 경우 정보 저장
        const userRef = database.ref('users/' + result.user.uid);
        const snapshot = await userRef.once('value');
        
        if (!snapshot.exists()) {
            await userRef.set({
                name: result.user.displayName,
                email: result.user.email,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            });
        }
    } catch (error) {
        alert('Google 로그인 실패: ' + error.message);
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
    } catch (error) {
        alert('로그아웃 실패: ' + error.message);
    }
}

// ========== 화면 전환 ==========
function showAuth() {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appScreen').style.display = 'none';
}

function showApp() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    
    // 사용자 정보 표시
    const userName = currentUser.displayName || '사용자';
    const userEmail = currentUser.email;
    document.getElementById('userName').textContent = userName;
    document.getElementById('userEmail').textContent = userEmail;
    document.getElementById('userInitial').textContent = userName.charAt(0).toUpperCase();
}

function toggleUserMenu() {
    document.getElementById('userDropdown').classList.toggle('active');
}

// 다른 곳 클릭시 메뉴 닫기
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu && !userMenu.contains(e.target)) {
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// ========== 팀 관리 ==========
async function loadUserTeams() {
    try {
        const snapshot = await database.ref('userTeams/' + currentUser.uid).once('value');
        const teamIds = snapshot.val() || {};
        
        const teamSelector = document.getElementById('teamSelector');
        teamSelector.innerHTML = '<option value="">팀 선택...</option>';
        
        for (const teamId in teamIds) {
            const teamSnapshot = await database.ref('teams/' + teamId).once('value');
            const team = teamSnapshot.val();
            if (team) {
                const option = document.createElement('option');
                option.value = teamId;
                option.textContent = team.name;
                teamSelector.appendChild(option);
            }
        }
        
        // 팀이 없으면 안내 화면 표시
        if (Object.keys(teamIds).length === 0) {
            document.getElementById('noTeamSelected').style.display = 'flex';
            document.getElementById('mainContent').style.display = 'none';
        }
    } catch (error) {
        console.error('팀 로딩 실패:', error);
    }
}

async function handleTeamChange(e) {
    const teamId = e.target.value;
    
    if (!teamId) {
        document.getElementById('noTeamSelected').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
        currentTeam = null;
        return;
    }
    
    try {
        const snapshot = await database.ref('teams/' + teamId).once('value');
        currentTeam = { id: teamId, ...snapshot.val() };
        
        document.getElementById('noTeamSelected').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        
        // 오늘 날짜로 초기화
        const today = new Date();
        selectedDate = formatDate(today);
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        
        // 팀 정보 표시
        displayTeamInfo();
        
        // 데이터 로드
        renderCalendar();
        renderTodos();
        loadChatMessages();
        
        // 실시간 리스너 설정
        setupRealtimeListeners();
        
    } catch (error) {
        console.error('팀 로딩 실패:', error);
        alert('팀을 불러오는데 실패했습니다.');
    }
}

function displayTeamInfo() {
    document.getElementById('currentTeamName').textContent = currentTeam.name;
    loadTeamMembers();
    
    // 팀 삭제 버튼 표시 (관리자만)
    const deleteBtn = document.getElementById('deleteTeamBtn');
    if (currentTeam.createdBy === currentUser.uid) {
        deleteBtn.style.display = 'block';
    } else {
        deleteBtn.style.display = 'none';
    }
}

async function loadTeamMembers() {
    try {
        const snapshot = await database.ref('teamMembers/' + currentTeam.id).once('value');
        const memberIds = snapshot.val() || {};
        
        const membersList = document.getElementById('membersList');
        membersList.innerHTML = '';
        
        let count = 0;
        for (const userId in memberIds) {
            const userSnapshot = await database.ref('users/' + userId).once('value');
            const user = userSnapshot.val();
            if (user) {
                count++;
                const memberDiv = document.createElement('div');
                memberDiv.className = 'member-item';
                memberDiv.innerHTML = `
                    <div class="member-avatar">${user.name.charAt(0).toUpperCase()}</div>
                    <div class="member-info">
                        <div class="member-name">${user.name}</div>
                        <div class="member-role">${memberIds[userId].role === 'admin' ? '관리자' : '멤버'}</div>
                    </div>
                `;
                membersList.appendChild(memberDiv);
            }
        }
        
        document.getElementById('memberCount').textContent = count;
    } catch (error) {
        console.error('팀원 로딩 실패:', error);
    }
}

async function handleCreateTeam() {
    const name = document.getElementById('newTeamName').value.trim();
    const desc = document.getElementById('newTeamDesc').value.trim();
    
    if (!name) {
        alert('팀 이름을 입력하세요.');
        return;
    }
    
    try {
        // 6자리 랜덤 팀 코드 생성
        const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // 팀 생성
        const teamRef = database.ref('teams').push();
        const teamId = teamRef.key;
        
        await teamRef.set({
            name: name,
            description: desc,
            code: teamCode,
            createdBy: currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        
        // 생성자를 관리자로 추가
        await database.ref('teamMembers/' + teamId + '/' + currentUser.uid).set({
            role: 'admin',
            joinedAt: firebase.database.ServerValue.TIMESTAMP
        });
        
        // 사용자의 팀 목록에 추가
        await database.ref('userTeams/' + currentUser.uid + '/' + teamId).set(true);
        
        closeModal('createTeamModal');
        document.getElementById('newTeamName').value = '';
        document.getElementById('newTeamDesc').value = '';
        
        await loadUserTeams();
        
        // 새로 만든 팀 선택
        document.getElementById('teamSelector').value = teamId;
        handleTeamChange({ target: { value: teamId } });
        
    } catch (error) {
        console.error('팀 생성 실패:', error);
        alert('팀 생성에 실패했습니다.');
    }
}

async function handleJoinTeam() {
    const code = document.getElementById('teamCode').value.trim().toUpperCase();
    
    if (!code) {
        alert('팀 코드를 입력하세요.');
        return;
    }
    
    try {
        // 코드로 팀 찾기
        const snapshot = await database.ref('teams').orderByChild('code').equalTo(code).once('value');
        const teams = snapshot.val();
        
        if (!teams) {
            alert('존재하지 않는 팀 코드입니다.');
            return;
        }
        
        const teamId = Object.keys(teams)[0];
        
        // 이미 팀 멤버인지 확인
        const memberSnapshot = await database.ref('teamMembers/' + teamId + '/' + currentUser.uid).once('value');
        if (memberSnapshot.exists()) {
            alert('이미 참여중인 팀입니다.');
            return;
        }
        
        // 팀에 멤버로 추가
        await database.ref('teamMembers/' + teamId + '/' + currentUser.uid).set({
            role: 'member',
            joinedAt: firebase.database.ServerValue.TIMESTAMP
        });
        
        // 사용자의 팀 목록에 추가
        await database.ref('userTeams/' + currentUser.uid + '/' + teamId).set(true);
        
        closeModal('joinTeamModal');
        document.getElementById('teamCode').value = '';
        
        await loadUserTeams();
        
        // 참여한 팀 선택
        document.getElementById('teamSelector').value = teamId;
        handleTeamChange({ target: { value: teamId } });
        
        alert('팀에 참여했습니다!');
        
    } catch (error) {
        console.error('팀 참여 실패:', error);
        alert('팀 참여에 실패했습니다.');
    }
}

async function handleDeleteTeam() {
    if (!currentTeam) {
        alert('선택된 팀이 없습니다.');
        return;
    }
    
    // 팀 생성자인지 확인
    if (currentTeam.createdBy !== currentUser.uid) {
        alert('팀을 삭제할 권한이 없습니다. (관리자만 삭제 가능)');
        return;
    }
    
    const confirmMessage = `정말로 "${currentTeam.name}" 팀을 삭제하시겠습니까?\n\n⚠️ 경고:\n- 팀의 모든 할일이 삭제됩니다.\n- 팀의 모든 채팅 기록이 삭제됩니다.\n- 팀의 모든 파일이 삭제됩니다.\n- 이 작업은 되돌릴 수 없습니다!`;
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    const doubleCheck = prompt('정말 삭제하시려면 팀 이름을 입력하세요:', '');
    if (doubleCheck !== currentTeam.name) {
        alert('팀 이름이 일치하지 않습니다. 삭제가 취소되었습니다.');
        return;
    }
    
    try {
        const teamId = currentTeam.id;
        
        // 1. 팀 데이터 삭제
        await database.ref('teams/' + teamId).remove();
        
        // 2. 팀원 정보 삭제
        await database.ref('teamMembers/' + teamId).remove();
        
        // 3. 할일 삭제
        await database.ref('todos/' + teamId).remove();
        
        // 4. 채팅 삭제
        await database.ref('chat/' + teamId).remove();
        
        // 5. 댓글 삭제
        await database.ref('comments/' + teamId).remove();
        
        // 6. 모든 사용자의 팀 목록에서 삭제
        const memberSnapshot = await database.ref('teamMembers/' + teamId).once('value');
        const members = memberSnapshot.val() || {};
        for (const userId in members) {
            await database.ref('userTeams/' + userId + '/' + teamId).remove();
        }
        
        // 7. Storage에서 팀 파일 삭제 (선택사항 - 시간이 걸릴 수 있음)
        try {
            const storageRef = storage.ref('teams/' + teamId);
            const filesList = await storageRef.listAll();
            for (const fileRef of filesList.items) {
                await fileRef.delete();
            }
        } catch (storageError) {
            console.warn('파일 삭제 중 일부 오류:', storageError);
        }
        
        // 8. 리스너 제거
        removeRealtimeListeners();
        
        // 9. 현재 팀 초기화
        currentTeam = null;
        
        // 10. 팀 목록 새로고침
        await loadUserTeams();
        
        // 11. 화면 초기화
        document.getElementById('teamSelector').value = '';
        document.getElementById('noTeamSelected').style.display = 'flex';
        document.getElementById('mainContent').style.display = 'none';
        
        alert('팀이 성공적으로 삭제되었습니다.');
        
    } catch (error) {
        console.error('팀 삭제 실패:', error);
        alert('팀 삭제에 실패했습니다: ' + error.message);
    }
}

function handleCopyTeamCode() {
    const code = document.getElementById('displayTeamCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('팀 코드가 복사되었습니다!');
    }).catch(err => {
        alert('복사 실패: ' + err);
    });
}

// ========== 모달 관리 ==========
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    // 팀원 초대 모달인 경우 팀 코드 표시
    if (modalId === 'inviteMemberModal' && currentTeam) {
        document.getElementById('displayTeamCode').textContent = currentTeam.code;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ========== 달력 ==========
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00');
}

function getDateType(dateStr) {
    const today = formatDate(new Date());
    if (dateStr < today) return 'past';
    if (dateStr === today) return 'today';
    return 'future';
}

function updateDateDisplay() {
    const date = parseDate(selectedDate);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    document.getElementById('selectedDate').textContent = date.toLocaleDateString('ko-KR', options);
    
    const dateType = getDateType(selectedDate);
    let typeText = '';
    const dateTypeElement = document.getElementById('dateType');
    dateTypeElement.className = 'date-type ' + dateType;
    
    if (dateType === 'past') {
        typeText = '📅 과거의 할일';
    } else if (dateType === 'today') {
        typeText = '✨ 오늘의 할일';
    } else {
        typeText = '🎯 미래의 할일';
    }
    
    dateTypeElement.textContent = typeText;
}

async function renderCalendar() {
    document.getElementById('currentMonth').textContent = `${currentYear}년 ${currentMonth + 1}월`;
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const prevLastDay = new Date(currentYear, currentMonth, 0);
    
    let daysHTML = '';
    
    // 이전 달
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = prevLastDay.getDate() - i;
        daysHTML += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    // 현재 달
    const today = formatDate(new Date());
    
    // 해당 월의 할일 개수 가져오기
    const monthStart = formatDate(firstDay);
    const monthEnd = formatDate(lastDay);
    let todosCount = {};
    
    if (currentTeam) {
        try {
            const snapshot = await database.ref('todos/' + currentTeam.id)
                .orderByChild('date')
                .startAt(monthStart)
                .endAt(monthEnd)
                .once('value');
            
            const todos = snapshot.val() || {};
            Object.values(todos).forEach(todo => {
                todosCount[todo.date] = (todosCount[todo.date] || 0) + 1;
            });
        } catch (error) {
            console.error('할일 개수 로딩 실패:', error);
        }
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = formatDate(new Date(currentYear, currentMonth, day));
        const isToday = dateStr === today;
        const isSelected = dateStr === selectedDate;
        const hasTodos = todosCount[dateStr] > 0;
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isSelected) classes += ' selected';
        if (hasTodos) classes += ' has-todos';
        
        daysHTML += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }
    
    // 다음 달
    const totalCells = Math.ceil((firstDayOfWeek + lastDay.getDate()) / 7) * 7;
    const remainingCells = totalCells - (firstDayOfWeek + lastDay.getDate());
    
    for (let day = 1; day <= remainingCells; day++) {
        daysHTML += `<div class="calendar-day other-month">${day}</div>`;
    }
    
    document.getElementById('calendarDays').innerHTML = daysHTML;
    
    // 날짜 클릭 이벤트
    document.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayElement => {
        dayElement.addEventListener('click', () => {
            selectedDate = dayElement.dataset.date;
            renderCalendar();
            renderTodos();
            updateDateDisplay();
        });
    });
    
    updateDateDisplay();
}

function handlePrevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function handleNextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// ========== 파일 관리 ==========
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    attachedFiles = [...attachedFiles, ...files];
    displayAttachedFiles();
}

function displayAttachedFiles() {
    const container = document.getElementById('attachedFiles');
    if (attachedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = attachedFiles.map((file, index) => `
        <div class="file-chip">
            <span>📎 ${file.name}</span>
            <button class="file-chip-remove" onclick="removeAttachedFile(${index})">×</button>
        </div>
    `).join('');
}

function removeAttachedFile(index) {
    attachedFiles.splice(index, 1);
    displayAttachedFiles();
    document.getElementById('fileInput').value = '';
}

async function uploadFiles(todoId) {
    const uploadedUrls = [];
    
    for (const file of attachedFiles) {
        try {
            const storageRef = storage.ref(`teams/${currentTeam.id}/todos/${todoId}/${file.name}`);
            await storageRef.put(file);
            const url = await storageRef.getDownloadURL();
            uploadedUrls.push({
                name: file.name,
                url: url,
                size: file.size,
                type: file.type
            });
        } catch (error) {
            console.error('파일 업로드 실패:', file.name, error);
        }
    }
    
    return uploadedUrls;
}

// ========== 할일 관리 ==========
async function handleAddTodo() {
    const text = document.getElementById('todoInput').value.trim();
    
    if (!text) {
        alert('할일을 입력하세요!');
        return;
    }
    
    if (!currentTeam) {
        alert('팀을 선택하세요!');
        return;
    }
    
    try {
        const todoRef = database.ref('todos/' + currentTeam.id).push();
        const todoId = todoRef.key;
        
        // 파일 업로드
        const files = attachedFiles.length > 0 ? await uploadFiles(todoId) : [];
        
        const todo = {
            id: todoId,
            text: text,
            date: selectedDate,
            completed: false,
            createdBy: currentUser.uid,
            createdByName: currentUser.displayName || '사용자',
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            files: files
        };
        
        await todoRef.set(todo);
        
        document.getElementById('todoInput').value = '';
        attachedFiles = [];
        displayAttachedFiles();
        document.getElementById('fileInput').value = '';
        
    } catch (error) {
        console.error('할일 추가 실패:', error);
        alert('할일 추가에 실패했습니다.');
    }
}

async function handleToggleTodo(todoId, completed) {
    try {
        await database.ref('todos/' + currentTeam.id + '/' + todoId).update({
            completed: !completed
        });
    } catch (error) {
        console.error('할일 토글 실패:', error);
    }
}

async function handleDeleteTodo(todoId) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await database.ref('todos/' + currentTeam.id + '/' + todoId).remove();
    } catch (error) {
        console.error('할일 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
    }
}

async function handleClearCompleted() {
    if (!currentTeam) return;
    
    try {
        const snapshot = await database.ref('todos/' + currentTeam.id)
            .orderByChild('date')
            .equalTo(selectedDate)
            .once('value');
        
        const todos = snapshot.val() || {};
        const completed = Object.values(todos).filter(t => t.completed);
        
        if (completed.length === 0) {
            alert('완료된 항목이 없습니다!');
            return;
        }
        
        if (!confirm(`완료된 ${completed.length}개의 항목을 삭제하시겠습니까?`)) return;
        
        for (const todo of completed) {
            await database.ref('todos/' + currentTeam.id + '/' + todo.id).remove();
        }
        
    } catch (error) {
        console.error('완료 항목 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
    }
}

async function renderTodos() {
    if (!currentTeam) return;
    
    try {
        const snapshot = await database.ref('todos/' + currentTeam.id)
            .orderByChild('date')
            .equalTo(selectedDate)
            .once('value');
        
        let todos = [];
        snapshot.forEach(child => {
            todos.push(child.val());
        });
        
        // 필터 적용
        if (currentFilter === 'active') {
            todos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            todos = todos.filter(t => t.completed);
        }
        
        // 통계 업데이트
        const allSnapshot = await database.ref('todos/' + currentTeam.id)
            .orderByChild('date')
            .equalTo(selectedDate)
            .once('value');
        
        let allTodos = [];
        allSnapshot.forEach(child => {
            allTodos.push(child.val());
        });
        
        const total = allTodos.length;
        const active = allTodos.filter(t => !t.completed).length;
        const completed = allTodos.filter(t => t.completed).length;
        
        document.getElementById('totalCount').textContent = total;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('completedCount').textContent = completed;
        
        // 할일 목록 렌더링
        const todoList = document.getElementById('todoList');
        
        if (todos.length === 0) {
            let emptyMessage = '할일이 없습니다 ✨';
            if (currentFilter === 'active') {
                emptyMessage = '진행중인 할일이 없습니다 🎉';
            } else if (currentFilter === 'completed') {
                emptyMessage = '완료된 할일이 없습니다 📝';
            }
            todoList.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
            return;
        }
        
        todoList.innerHTML = todos.map(todo => {
            const date = new Date(todo.createdAt);
            const timeString = date.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            return `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" onclick="openTodoDetail('${todo.id}')">
                    <input 
                        type="checkbox" 
                        class="todo-checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onclick="event.stopPropagation(); handleToggleTodo('${todo.id}', ${todo.completed})"
                    >
                    <div class="todo-text-container">
                        <div class="todo-text">${escapeHtml(todo.text)}</div>
                        <div class="todo-meta">
                            <span>👤 ${escapeHtml(todo.createdByName)}</span>
                            <span>🕒 ${timeString}</span>
                            ${todo.files && todo.files.length > 0 ? `<span>📎 ${todo.files.length}</span>` : ''}
                        </div>
                    </div>
                    <button class="btn-delete" onclick="event.stopPropagation(); handleDeleteTodo('${todo.id}')">삭제</button>
                </li>
            `;
        }).join('');
        
    } catch (error) {
        console.error('할일 렌더링 실패:', error);
    }
}

// ========== 할일 상세 (댓글) ==========
async function openTodoDetail(todoId) {
    try {
        const snapshot = await database.ref('todos/' + currentTeam.id + '/' + todoId).once('value');
        const todo = snapshot.val();
        
        if (!todo) return;
        
        currentTodoForDetail = todoId;
        
        document.getElementById('todoDetailTitle').textContent = todo.text;
        document.getElementById('todoCreator').textContent = todo.createdByName;
        document.getElementById('todoCreatedAt').textContent = new Date(todo.createdAt).toLocaleString('ko-KR');
        
        // 파일 표시
        const filesContainer = document.getElementById('todoFiles');
        if (todo.files && todo.files.length > 0) {
            filesContainer.innerHTML = '<p><strong>첨부 파일:</strong></p>' + 
                todo.files.map(file => `
                    <a href="${file.url}" target="_blank" class="file-link">
                        📎 ${file.name}
                    </a>
                `).join('');
        } else {
            filesContainer.innerHTML = '';
        }
        
        // 댓글 로드
        loadComments(todoId);
        
        openModal('todoDetailModal');
        
    } catch (error) {
        console.error('할일 상세 로딩 실패:', error);
    }
}

async function loadComments(todoId) {
    try {
        const snapshot = await database.ref('comments/' + currentTeam.id + '/' + todoId)
            .orderByChild('createdAt')
            .once('value');
        
        const comments = [];
        snapshot.forEach(child => {
            comments.push(child.val());
        });
        
        const commentsList = document.getElementById('commentsList');
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #999;">댓글이 없습니다</p>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.authorName)}</span>
                    <span class="comment-time">${new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div class="comment-text">${escapeHtml(comment.text)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('댓글 로딩 실패:', error);
    }
}

async function handleAddComment() {
    const text = document.getElementById('commentInput').value.trim();
    
    if (!text) {
        alert('댓글을 입력하세요!');
        return;
    }
    
    try {
        const commentRef = database.ref('comments/' + currentTeam.id + '/' + currentTodoForDetail).push();
        
        await commentRef.set({
            id: commentRef.key,
            text: text,
            authorId: currentUser.uid,
            authorName: currentUser.displayName || '사용자',
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        
        document.getElementById('commentInput').value = '';
        loadComments(currentTodoForDetail);
        
    } catch (error) {
        console.error('댓글 추가 실패:', error);
        alert('댓글 추가에 실패했습니다.');
    }
}

// ========== 채팅 ==========
async function loadChatMessages() {
    if (!currentTeam) return;
    
    try {
        const snapshot = await database.ref('chat/' + currentTeam.id)
            .orderByChild('timestamp')
            .limitToLast(50)
            .once('value');
        
        const messages = [];
        snapshot.forEach(child => {
            messages.push(child.val());
        });
        
        displayChatMessages(messages);
        
    } catch (error) {
        console.error('채팅 메시지 로딩 실패:', error);
    }
}

function displayChatMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    
    if (messages.length === 0) {
        chatMessages.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">메시지가 없습니다</p>';
        return;
    }
    
    chatMessages.innerHTML = messages.map(msg => {
        const isOwn = msg.userId === currentUser.uid;
        const time = new Date(msg.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="chat-message ${isOwn ? 'own' : ''}">
                <div class="chat-message-header">
                    <span class="chat-message-author">${escapeHtml(msg.userName)}</span>
                    <span>${time}</span>
                </div>
                <div class="chat-message-bubble">${escapeHtml(msg.text)}</div>
            </div>
        `;
    }).join('');
    
    // 스크롤을 맨 아래로
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleSendMessage() {
    const text = document.getElementById('chatInput').value.trim();
    
    if (!text) return;
    
    if (!currentTeam) {
        alert('팀을 선택하세요!');
        return;
    }
    
    try {
        const messageRef = database.ref('chat/' + currentTeam.id).push();
        
        await messageRef.set({
            id: messageRef.key,
            text: text,
            userId: currentUser.uid,
            userName: currentUser.displayName || '사용자',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        document.getElementById('chatInput').value = '';
        
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        alert('메시지 전송에 실패했습니다.');
    }
}

// ========== 실시간 리스너 ==========
let currentListeners = {
    todos: null,
    chat: null,
    members: null
};

function setupRealtimeListeners() {
    if (!currentTeam) return;
    
    // 기존 리스너 제거
    removeRealtimeListeners();
    
    // 할일 변경 감지
    currentListeners.todos = database.ref('todos/' + currentTeam.id);
    currentListeners.todos.on('value', () => {
        renderTodos();
        renderCalendar();
    });
    
    // 채팅 메시지 변경 감지
    currentListeners.chat = database.ref('chat/' + currentTeam.id);
    currentListeners.chat.on('child_added', (snapshot) => {
        const msg = snapshot.val();
        if (msg) {
            loadChatMessages();
        }
    });
    
    // 팀원 변경 감지
    currentListeners.members = database.ref('teamMembers/' + currentTeam.id);
    currentListeners.members.on('value', () => {
        loadTeamMembers();
    });
}

function removeRealtimeListeners() {
    if (currentListeners.todos) {
        currentListeners.todos.off();
        currentListeners.todos = null;
    }
    if (currentListeners.chat) {
        currentListeners.chat.off();
        currentListeners.chat = null;
    }
    if (currentListeners.members) {
        currentListeners.members.off();
        currentListeners.members = null;
    }
}

// ========== 유틸리티 ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
