export class ConvexHttpClient {
    constructor(url: string) { }
    query(query: any, args?: any): Promise<any> { return Promise.resolve(null); }
    mutation(mutation: any, args?: any): Promise<any> { return Promise.resolve(null); }
}

export const api = {
    jobs: {
        getAgentJobs: 'jobs:getAgentJobs',
        cancelJob: 'jobs:cancelJob',
        getJob: 'jobs:getJob',
        queueCodeIteration: 'jobs:queueCodeIteration',
        queueSpecialistDelegation: 'jobs:queueSpecialistDelegation',
        queueAgentTask: 'jobs:queueAgentTask',
        updateJobStatusPublic: 'jobs:updateJobStatusPublic',
        logJobEventPublic: 'jobs:logJobEventPublic',
    },
    aiSettings: {
        getSettings: 'aiSettings:getSettings',
    },
    erv: {
        createEntity: 'erv:createEntity',
        createRelationship: 'erv:createRelationship',
        createDimension: 'erv:createDimension',
        listDimensions: 'erv:listDimensions',
        searchEntities: 'erv:searchEntities',
        getEntity: 'erv:getEntity',
    },
    jamz: {
        createProject: 'jamz:createProject',
        createTrack: 'jamz:createTrack',
        createClip: 'jamz:createClip',
    },
    messages: {
        send: 'messages:send',
    },
    whatsappContacts: {
        list: 'whatsappContacts:list',
        getContactByPhone: 'whatsappContacts:getContactByPhone',
        listContacts: 'whatsappContacts:listContacts',
        upsertContact: 'whatsappContacts:upsertContact',
    },
    channels: {
        list: 'channels:list',
        getChannel: 'channels:getChannel',
        sendMessage: 'channels:sendMessage',
        getUserMessages: 'channels:getUserMessages',
        getUserIntegrations: 'channels:getUserIntegrations',
        getConversations: 'channels:getConversations',
        getIntegration: 'channels:getIntegration',
        logOutboundMessage: 'channels:logOutboundMessage',
        searchMessages: 'channels:searchMessages',
    },
    scheduling: {
        list: 'scheduling:list',
        createEvent: 'scheduling:createEvent',
        getEventTypes: 'scheduling:getEventTypes',
        getAvailableSlots: 'scheduling:getAvailableSlots',
        createBooking: 'scheduling:createBooking',
        rescheduleBooking: 'scheduling:rescheduleBooking',
        updateBookingStatus: 'scheduling:updateBookingStatus',
    },
    userCronJobs: {
        list: 'userCronJobs:list',
        create: 'userCronJobs:create',
        delete: 'userCronJobs:delete',
        createJob: 'userCronJobs:createJob',
        getUserJobs: 'userCronJobs:getUserJobs',
        toggleJob: 'userCronJobs:toggleJob',
        deleteJob: 'userCronJobs:deleteJob',
    },
    compaction: {
        compact: 'compaction:compact',
        getLatestCompaction: 'compaction:getLatestCompaction',
    },
    kanban: {
        listLists: 'kanban:listLists',
        createCard: 'kanban:createCard',
        moveCard: 'kanban:moveCard',
        getTaskById: 'kanban:getTaskById',
        searchTasks: 'kanban:searchTasks',
        getTasks: 'kanban:getTasks',
        isSeeded: 'kanban:isSeeded',
        addTask: 'kanban:addTask',
        updateTask: 'kanban:updateTask',
        deleteTask: 'kanban:deleteTask',
        moveTask: 'kanban:moveTask',
        seedTasks: 'kanban:seedTasks',
    },
    designCanvas: {
        getCanvas: 'designCanvas:getCanvas',
        updateCanvas: 'designCanvas:updateCanvas',
        createItem: 'designCanvas:createItem',
        createCanvas: 'designCanvas:createCanvas',
        getUserCanvases: 'designCanvas:getUserCanvases',
        getCanvasNodes: 'designCanvas:getCanvasNodes',
        getCanvasEdges: 'designCanvas:getCanvasEdges',
        addNode: 'designCanvas:addNode',
        addEdge: 'designCanvas:addEdge',
        updateNode: 'designCanvas:updateNode',
    },
    agentic: {
        createProductProject: 'agentic:createProductProject',
        createPRD: 'agentic:createPRD',
        createEpic: 'agentic:createEpic',
        createTicket: 'agentic:createTicket',
    },
    discovery: {
        getSession: 'discovery:getSession',
        storeInsights: 'discovery:storeInsights',
        storeArtifacts: 'discovery:storeArtifacts',
        markNotificationSent: 'discovery:markNotificationSent',
        markError: 'discovery:markError',
        getSessionByCallerId: 'discovery:getSessionByCallerId',
        updateTranscript: 'discovery:updateTranscript',
    },
    memories: {
        searchEpisodic: 'memories:searchEpisodic',
        getSemanticByCategories: 'memories:getSemanticByCategories',
        getAllSemantic: 'memories:getAllSemantic',
        getRecentEpisodic: 'memories:getRecentEpisodic',
        storeEpisodic: 'memories:storeEpisodic',
        upsertSemantic: 'memories:upsertSemantic',
        deleteEpisodic: 'memories:deleteEpisodic',
        deleteSemantic: 'memories:deleteSemantic',
        getMemoryStats: 'memories:getMemoryStats',
    },
    observability: {
        getSecurityScans: 'observability:getSecurityScans',
        createSecurityScan: 'observability:createSecurityScan',
        getActivityStream: 'observability:getActivityStream',
        getDashboardOverview: 'observability:getDashboardOverview',
        getProviderHealthStatus: 'observability:getProviderHealthStatus',
        logOperation: 'observability:logOperation',
    },
    roadmap: {
        submitSuggestion: 'roadmap:submitSuggestion',
        getSuggestions: 'roadmap:getSuggestions',
        updateSuggestionStatus: 'roadmap:updateSuggestionStatus',
        voteSuggestion: 'roadmap:voteSuggestion',
    }

};

// Export ConvexReactClient type for compatibility
export type ConvexReactClient = any;

export type Id<T extends string> = string;
