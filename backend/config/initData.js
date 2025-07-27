const ReplyGuide = require('../models/ReplyGuide');
const History = require('../models/History');
const User = require('../models/User');

// 템플릿 버전 관리
const TEMPLATE_VERSION = '1.0.0';

const initializeReplyGuides = async () => {
  try {
    // 기존 데이터 확인
    const existingCount = await ReplyGuide.countDocuments();
    
    if (existingCount > 0) {
      // 버전 확인을 위한 메타데이터 체크
      const versionDoc = await ReplyGuide.findOne({ isMetadata: true });
      
      if (versionDoc && versionDoc.templateVersion === TEMPLATE_VERSION) {
        return;
      } else {
        console.log('🔄 ReplyGuide 데이터 업데이트가 필요합니다.');
        // 기존 데이터 삭제 (메타데이터 제외)
        await ReplyGuide.deleteMany({ isMetadata: { $ne: true } });
      }
    }

    // 초기 템플릿 데이터
    const initialTemplates = [
      {
        category: 'apology',
        title: '늦은 응답 사과',
        situation: '이메일 답장이 늦었을 때',
        content: '안녕하세요.\n\n늦은 답변으로 인해 불편을 드려 죄송합니다.\n[구체적인 사유]로 인해 답변이 지연되었습니다.\n\n향후 이런 일이 발생하지 않도록 더욱 주의하겠습니다.\n\n감사합니다.'
      },
      {
        category: 'request',
        title: '정중한 자료 요청',
        situation: '동료나 거래처에 자료를 요청할 때',
        content: '안녕하세요.\n\n[프로젝트명] 관련하여 연락드립니다.\n\n[구체적인 자료명]에 대한 자료를 요청드리고 싶습니다.\n가능하시면 [날짜]까지 공유해 주시면 감사하겠습니다.\n\n바쁘신 중에도 협조해 주셔서 감사합니다.'
      },
      {
        category: 'response',
        title: '긍정적 피드백 응답',
        situation: '칭찬이나 긍정적 피드백을 받았을 때',
        content: '안녕하세요.\n\n소중한 피드백을 주셔서 진심으로 감사합니다.\n\n앞으로도 더 나은 결과를 위해 최선을 다하겠습니다.\n계속해서 좋은 협력 관계를 유지할 수 있기를 바랍니다.\n\n감사합니다.'
      },
      {
        category: 'meeting',
        title: '회의 일정 조율',
        situation: '회의 일정을 조율해야 할 때',
        content: '안녕하세요.\n\n[회의 주제] 관련 회의 일정을 조율하고자 합니다.\n\n제안 가능한 시간:\n- [날짜 시간]\n- [날짜 시간]\n- [날짜 시간]\n\n참석하시기 편한 시간을 알려주시면 감사하겠습니다.\n\n감사합니다.'
      },
      {
        category: 'request',
        title: '업무 협조 요청',
        situation: '동료에게 업무 도움을 요청할 때',
        content: '안녕하세요.\n\n[업무명] 진행 중 도움이 필요하여 연락드립니다.\n\n[구체적인 도움 내용]에 대해 조언을 구하고 싶습니다.\n시간이 되실 때 잠깐 이야기할 수 있을까요?\n\n바쁘신 중에 번거롭게 해드려 죄송합니다.\n감사합니다.'
      },
      {
        category: 'apology',
        title: '실수 사과',
        situation: '업무상 실수를 했을 때',
        content: '안녕하세요.\n\n[구체적인 실수 내용]에 대해 진심으로 사과드립니다.\n\n이번 일로 인해 불편을 드린 점 깊이 사과드립니다.\n앞으로는 이런 일이 발생하지 않도록 더욱 신중하게 업무를 진행하겠습니다.\n\n감사합니다.'
      },
      {
        category: 'meeting',
        title: '회의록 공유',
        situation: '회의 후 회의록을 공유할 때',
        content: '안녕하세요.\n\n[날짜]에 진행된 [회의명] 회의록을 공유드립니다.\n\n주요 논의 사항:\n• [내용 1]\n• [내용 2]\n• [내용 3]\n\n결정 사항:\n• [결정 1]\n• [결정 2]\n\n추가 논의가 필요한 사항이 있으시면 언제든 연락주세요.\n\n감사합니다.'
      },
      {
        category: 'response',
        title: '부정적 피드백 응답',
        situation: '비판이나 부정적 피드백을 받았을 때',
        content: '안녕하세요.\n\n소중한 피드백을 주셔서 감사합니다.\n\n말씀해 주신 내용을 진지하게 검토하고 개선하겠습니다.\n앞으로는 더 나은 결과를 위해 노력하겠습니다.\n\n지속적인 관심과 지도 부탁드립니다.\n\n감사합니다.'
      }
    ];

    // 템플릿 데이터 삽입
    await ReplyGuide.insertMany(initialTemplates);
    
    // 버전 메타데이터 저장/업데이트
    await ReplyGuide.findOneAndUpdate(
      { isMetadata: true },
      { 
        isMetadata: true,
        templateVersion: TEMPLATE_VERSION,
        lastUpdated: new Date()
      },
      { upsert: true }
    );
    
    console.log('✅ ReplyGuide 초기 데이터 삽입/업데이트 완료 (버전: ' + TEMPLATE_VERSION + ')');
  } catch (error) {
    console.error('❌ ReplyGuide 초기화 실패:', error);
  }
};

const initializeHistory = async () => {
  try {
    // 기존 데이터 확인
    const existingCount = await History.countDocuments();
    
    if (existingCount > 0) {
      return;
    }

    // 테스트 사용자 찾기 (없으면 생성)
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        email: 'test@example.com',
        password: 'test123',
        name: '테스트 사용자'
      });
      await testUser.save();
    }

    // 초기 히스토리 데이터
    const initialHistory = [
      {
        user: testUser._id,
        type: 'review',
        title: '프로젝트 일정 연기 요청 메일',
        content: '안녕하세요. 현재 진행 중인 프로젝트의 일정 조정이 필요하여 연락드립니다. 예상보다 복잡한 요구사항이 추가되어 원래 계획된 일정을 지키기 어려운 상황입니다. 가능하시면 일정을 1주일 정도 연기해주실 수 있을까요?',
        recipient: '김팀장님',
        date: new Date('2024-01-15T14:30:00'),
        score: 92,
        status: 'sent'
      },
      {
        user: testUser._id,
        type: 'manual',
        title: '회의 일정 조율 메일',
        content: '안녕하세요. 다음 주 팀 회의 일정을 조율하고자 합니다. 월요일 오후 2시, 화요일 오전 10시, 수요일 오후 4시 중에서 참석 가능한 시간을 알려주시면 감사하겠습니다.',
        recipient: '개발팀 전체',
        date: new Date('2024-01-14T11:15:00'),
        template: '회의 일정 조율',
        status: 'sent'
      },
      {
        user: testUser._id,
        type: 'review',
        title: '급히 확인 요청 메일',
        content: '급히 확인해주세요. 프로젝트 관련 중요한 이슈가 발생했습니다. 서버 오류로 인해 사용자들이 로그인할 수 없는 상황입니다. 가능한 빨리 확인하고 조치해주시면 감사하겠습니다.',
        recipient: '박과장님',
        date: new Date('2024-01-13T16:45:00'),
        score: 65,
        status: 'draft'
      },
      {
        user: testUser._id,
        type: 'review',
        title: '업무 협조 요청',
        content: '안녕하세요. 현재 담당하고 있는 업무에서 도움이 필요하여 연락드립니다. 데이터 분석 부분에서 전문적인 조언이 필요합니다. 시간이 되실 때 잠깐 상담할 수 있을까요?',
        recipient: '이대리님',
        date: new Date('2024-01-12T09:20:00'),
        score: 88,
        status: 'sent'
      },
      {
        user: testUser._id,
        type: 'manual',
        title: '늦은 응답 사과 메일',
        content: '안녕하세요. 늦은 답변으로 인해 불편을 드려 죄송합니다. 바쁜 업무로 인해 답변이 지연되었습니다. 앞으로는 더 신속하게 답변하도록 하겠습니다.',
        recipient: '최부장님',
        date: new Date('2024-01-11T13:55:00'),
        template: '늦은 응답 사과',
        status: 'sent'
      }
    ];

    // 히스토리 데이터 삽입
    await History.insertMany(initialHistory);
    
    console.log('✅ History 초기 데이터 삽입 완료');
  } catch (error) {
    console.error('❌ History 초기화 실패:', error);
  }
};

module.exports = { initializeReplyGuides, initializeHistory }; 